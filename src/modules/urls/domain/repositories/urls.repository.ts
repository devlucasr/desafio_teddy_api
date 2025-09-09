import type { Url } from '@prisma/client';
import { CreateUrlInput } from '../types/url-types';

export interface IUrlsRepository {
  create(data: CreateUrlInput): Promise<Url>
  findByShortCode(shortCode: string): Promise<Url | null>
  isShortCodeTaken(shortCode: string): Promise<boolean>
  recordClick(
    urlId: string,
    meta?: { ip?: string; userAgent?: string }
  ): Promise<void>

  listByOwner(
    ownerId: string
  ): Promise<
    Array<{
      id: string
      shortCode: string
      originalUrl: string
      clicks: number
      createdAt: Date
      updatedAt: Date
    }>
  >

  updateDestinationIfOwner(id: string, ownerId: string, destination: string): Promise<boolean>
  findByIdAndOwner(id: string, ownerId: string): Promise<{
    id: string
    shortCode: string
    originalUrl: string
    clicks: number
    createdAt: Date
    updatedAt: Date
  } | null>

  softDeleteIfOwner(id: string, ownerId: string): Promise<boolean>

}

export const URLS_REPOSITORY = Symbol('URLS_REPOSITORY');
