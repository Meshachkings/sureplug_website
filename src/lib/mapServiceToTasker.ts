import type { ApiService } from './api';
import type { Tasker } from '../data/taskers';

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=200`;

const SERVICE_IMAGE_FALLBACK: Record<string, string> = {
  Plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=280&fit=crop',
  Cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop',
  Electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=280&fit=crop',
  Moving: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop',
  Assembly: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=280&fit=crop',
  'Home Repair': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=280&fit=crop',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop';

export function providerProfileRouteId(service: ApiService): string | null {
  const tag = service.provider.suretag?.trim();
  if (tag) return tag;
  const providerId = service.provider._id?.trim();
  if (providerId) return providerId;
  return null;
}

export function mapServiceToTasker(service: ApiService): Tasker | null {
  const id = providerProfileRouteId(service);
  if (!id) return null;

  const providerName = `${service.provider.firstName} ${service.provider.lastName}`.trim();
  const categoryName = (service.categoryId?.name ?? '').trim();
  const avatarUrl =
    service.images?.[0]?.url ||
    service.categoryId?.image?.url ||
    service.provider.avatar?.url ||
    SERVICE_IMAGE_FALLBACK[categoryName] ||
    AVATAR_PLACEHOLDER(providerName) ||
    DEFAULT_IMAGE;

  return {
    id,
    serviceId: service._id,
    name: providerName,
    role: service.title,
    category: categoryName,
    tags: categoryName ? [categoryName] : [],
    image: avatarUrl,
    rating: service.averageRating ?? 0,
    reviews: service.reviewCount ?? 0,
    price: service.price ?? 0,
    location: service.state || 'Nigeria',
    featured: (service.averageRating ?? 0) >= 4.5,
    isPremium: service.provider.isPremium,
    isVerified: Boolean(service.provider.isVerified || service.provider.businessVerified),
  };
}

export function mapPublicServicesToTaskers(services: ApiService[]): Tasker[] {
  return services.map(mapServiceToTasker).filter((t): t is Tasker => t !== null);
}
