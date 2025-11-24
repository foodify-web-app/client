'use client';

import { Camera, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRestaurant } from '@/context/restaurant-context';
import { updateRestaurant, updateRestaurantWithImage } from '@/api/api';
import { useToast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 characters').optional().or(z.literal('')),
  address: z.string().optional(),
  description: z.string().optional(),
  cuisineType: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

const CUISINE_TYPES = [
  'Indian',
  'Chinese',
  'Italian',
  'Mexican',
  'Japanese',
  'Thai',
  'American',
  'Mediterranean',
  'Fast Food',
  'Desserts',
  'Beverages',
  'Other',
];

export default function RestaurantProfile() {
  const { restaurant, updateRestaurant: updateRestaurantData, loading: restaurantLoading } = useRestaurant();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      cuisineType: '',
      openingTime: '',
      closingTime: '',
    },
  });

  useEffect(() => {
    if (restaurant) {
      form.reset({
        name: restaurant.name || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        address: restaurant.address || '',
        description: restaurant.description || '',
        cuisineType: restaurant.cuisineTypes?.[0] || '',
        openingTime: restaurant.openingTime || '',
        closingTime: restaurant.closingTime || '',
      });
      if (restaurant.logo) setLogoPreview(restaurant.logo);
      if (restaurant.image) setCoverPreview(restaurant.image);
    }
  }, [restaurant, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RestaurantFormValues) => {
    if (!restaurant?._id) {
      toast({ message: 'Restaurant not found', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const updateData: any = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        description: data.description || undefined,
        cuisineTypes: data.cuisineType ? [data.cuisineType] : undefined,
        openingTime: data.openingTime || undefined,
        closingTime: data.closingTime || undefined,
      };

      // If images are selected, use FormData
      if (logoFile || coverFile) {
        const formData = new FormData();
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] !== undefined) {
            formData.append(key, updateData[key]);
          }
        });
        if (logoFile) formData.append('logo', logoFile);
        if (coverFile) formData.append('image', coverFile);

        const response = await updateRestaurantWithImage(restaurant._id, formData);
        if (response.data.success) {
          toast({ message: 'Restaurant updated successfully', type: 'success' });
          setIsEditing(false);
          await updateRestaurantData(updateData);
        } else {
          toast({ message: response.data.message || 'Failed to update restaurant', type: 'error' });
        }
      } else {
        // No images, use regular update
        const response = await updateRestaurant(restaurant._id, updateData);
        if (response.data.success) {
          toast({ message: 'Restaurant updated successfully', type: 'success' });
          setIsEditing(false);
          await updateRestaurantData(updateData);
        } else {
          toast({ message: response.data.message || 'Failed to update restaurant', type: 'error' });
        }
      }
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      toast({ message: error.response?.data?.message || 'Error updating restaurant', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (restaurantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">
          Restaurant not found. Please create a restaurant first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">Restaurant Settings</h1>
        <p className="text-foreground-secondary dark:text-dark-foreground-secondary">Manage your restaurant information</p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="dark:bg-zinc-800 card-base h-40 bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden relative group cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={!isEditing}
              className="hidden"
              id="cover-upload"
            />
            {coverPreview && (
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            )}
            <label
              htmlFor="cover-upload"
              className={cn(
                'absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer',
                !isEditing && 'cursor-not-allowed opacity-50'
              )}
            >
              <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </label>
          </motion.div>

          {/* Logo & Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="dark:bg-zinc-800 card-base p-6 lg:col-span-1"
            >
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={!isEditing}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className={cn(
                    'block w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center relative group cursor-pointer',
                    !isEditing && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">🍴</span>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
                      <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                  )}
                </label>
                <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{restaurant.name}</h3>
                <p className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                  ID: {restaurant._id.slice(-8)}
                </p>
                <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
                  Status: <span className={cn(
                    'font-semibold',
                    restaurant.status === 'approved' && 'text-success',
                    restaurant.status === 'pending' && 'text-warning',
                    restaurant.status === 'rejected' && 'text-error'
                  )}>{restaurant.status}</span>
                </p>
              </div>
            </motion.div>

            {/* Information Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="dark:bg-zinc-800 card-base p-6 lg:col-span-2 space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={!isEditing} rows={3} />
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
                      <Textarea {...field} disabled={!isEditing} rows={4} placeholder="Describe your restaurant..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuisineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CUISINE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                {!isEditing ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-primary text-white hover:bg-primary-dark"
                    >
                      Edit Profile
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                        setLogoFile(null);
                        setCoverFile(null);
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary text-white hover:bg-primary-dark"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
