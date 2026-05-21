import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { publicAccess } from '@/access/publicAccess'

export const TrustItems: CollectionConfig = {
  slug: 'trustItems',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    group: 'Marketing',
    defaultColumns: ['title', 'type', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['home', 'about'],
      defaultValue: 'home',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
