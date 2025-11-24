'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { motion } from 'framer-motion';
import { getDishesByRestaurant, createDish, updateDishById, deleteDish } from '@/api/api';
import { useToast } from '@/components/ui/toaster';
import { useRestaurant } from '@/context/restaurant-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const dishSchema = z.object({
  dishName: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  discountPrice: z.number().optional().nullable(),
  spiceLevel: z.enum(['mild', 'medium', 'hot']).optional(),
  veg: z.boolean().default(false),
  stockStatus: z.enum(['in-stock', 'out-of-stock']).default('in-stock'),
  estimatedPrepareTime: z.number().min(1, 'Estimated prepare time is required'),
  tags: z.string().optional(), // Comma-separated tags
});

type DishFormValues = z.infer<typeof dishSchema>;

const CATEGORIES = [
  'Biryani',
  'Pizzas',
  'Burgers',
  'Desserts',
  'Beverages',
  'Appetizers',
  'Main Course',
  'Salads',
  'Soups',
  'Snacks',
];

const SPICE_LEVELS = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Hot' },
];

export default function MenuManagement() {
  const { restaurantId, restaurantStatus } = useRestaurant();
  const { toast } = useToast();
  const [dishes, setDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDish, setEditingDish] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      dishName: '',
      description: '',
      category: '',
      subCategory: '',
      price: 0,
      discountPrice: null,
      spiceLevel: 'mild',
      veg: false,
      stockStatus: 'in-stock',
      estimatedPrepareTime: 15,
      tags: '',
    },
  });

  useEffect(() => {
    if (restaurantId) {
      loadDishes();
    }
  }, [restaurantId]);

  const loadDishes = async () => {
    if (!restaurantId) {
      toast({ message: 'Restaurant ID not found', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await getDishesByRestaurant(restaurantId);
      if (res.data.success && res.data.data) {
        setDishes(res.data.data);
      } else {
        // Fallback: Get all dishes and filter (if endpoint doesn't exist)
        const allRes = await getDishes();
        if (allRes.data.success && allRes.data.data) {
          // Filter by restaurantId if it exists in the dish model
          // For now, show all dishes (backend needs restaurantId field)
          setDishes(allRes.data.data);
        }
      }
    } catch (error: any) {
      console.error('Error loading dishes:', error);
      // Fallback to get all dishes
      try {
        const allRes = await getDishes();
        if (allRes.data.success && allRes.data.data) {
          setDishes(allRes.data.data);
        }
      } catch (e) {
        toast({ message: 'Error loading dishes', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (dish?: any) => {
    if (dish) {
      setEditingDish(dish);
      form.reset({
        dishName: dish.name || '',
        description: dish.description || '',
        category: dish.category || '',
        subCategory: dish.subCategory || '',
        price: dish.price || 0,
        discountPrice: dish.discountPrice || null,
        spiceLevel: dish.spiceLevel || 'mild',
        veg: dish.veg || false,
        stockStatus: dish.stockStatus || 'in-stock',
        estimatedPrepareTime: dish.estimatedPrepareTime || 15,
        tags: dish.tags?.join(', ') || '',
      });
      if (dish.image) setImagePreview(dish.image);
    } else {
      setEditingDish(null);
      form.reset();
      setImagePreview(null);
      setImageFile(null);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingDish(null);
    form.reset();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DishFormValues) => {
    if (!restaurantId) {
      toast({ message: 'Restaurant ID not found', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.dishName);
      formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.subCategory) formData.append('subCategory', data.subCategory);
      formData.append('price', data.price.toString());
      if (data.discountPrice) formData.append('discountPrice', data.discountPrice.toString());
      if (data.spiceLevel) formData.append('spiceLevel', data.spiceLevel);
      formData.append('veg', data.veg.toString());
      formData.append('stockStatus', data.stockStatus);
      formData.append('estimatedPrepareTime', data.estimatedPrepareTime.toString());
      if (data.tags) {
        const tagsArray = data.tags.split(',').map(t => t.trim()).filter(t => t);
        formData.append('tags', JSON.stringify(tagsArray));
      }
      formData.append('restaurantId', restaurantId);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (editingDish) {
        response = await updateDishById(editingDish._id, formData);
      } else {
        response = await createDish(formData);
      }

      if (response.data.success) {
        toast({
          message: editingDish ? 'Dish updated successfully' : 'Dish created successfully',
          type: 'success',
        });
        handleCloseDialog();
        loadDishes();
      } else {
        toast({
          message: response.data.message || 'Failed to save dish',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error('Error saving dish:', error);
      toast({
        message: error.response?.data?.message || 'Error saving dish',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await deleteDish(id);
      if (res.data.success) {
        toast({ message: 'Dish deleted successfully', type: 'success' });
        loadDishes();
      } else {
        toast({ message: res.data.message || 'Error deleting dish', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({ message: 'Error deleting dish', type: 'error' });
    }
  };

  const isApproved = restaurantStatus === 'approved';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Dish Management</h1>
          <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
            Manage your restaurant dishes and categories
          </p>
        </div>
        {isApproved && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Add Dish
          </motion.button>
        )}
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat}
              whileHover={{ y: -4 }}
              className="p-3 bg-surface dark:bg-dark-surface rounded-lg text-center cursor-pointer hover:border-primary border border-transparent transition-colors"
            >
              <p className="text-sm font-medium text-foreground dark:text-dark-foreground">{cat}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dishes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dark:bg-zinc-800 card-base p-6"
      >
        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-4">All Dishes</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Loading dishes...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
              No dishes found. {isApproved && 'Add your first dish!'}
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Dish Name',
                render: (_, item: any) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                ),
              },
              { key: 'category', label: 'Category' },
              {
                key: 'price',
                label: 'Price',
                render: (v) => `₹${Number(v).toFixed(2)}`,
              },
              {
                key: 'stockStatus',
                label: 'Stock',
                render: (v) => (
                  <Badge
                    variant={v === 'in-stock' ? 'default' : 'destructive'}
                    className={v === 'in-stock' ? 'bg-success/10 text-success' : ''}
                  >
                    {v === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                ),
              },
              {
                key: '_id',
                label: 'Actions',
                render: (_, item) => (
                  <div className="flex gap-2">
                    {isApproved && (
                      <>
                        <button
                          onClick={() => handleOpenDialog(item)}
                          className="p-1 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1 hover:bg-error/10 text-error rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            data={dishes}
            searchKeys={['name', 'category', 'description']}
          />
        )}
      </motion.div>

      {/* Add/Edit Dish Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDish ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
            <DialogDescription>
              {editingDish ? 'Update dish information' : 'Fill in the details to add a new dish'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Dish Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="dishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dish Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Butter Chicken" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Describe the dish..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Vegetarian Biryani" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price (₹) - Optional</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="spiceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spice Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SPICE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedPrepareTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Prepare Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="veg"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Vegetarian</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., spicy, popular, recommended" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Saving...
                    </>
                  ) : (
                    editingDish ? 'Update Dish' : 'Create Dish'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
