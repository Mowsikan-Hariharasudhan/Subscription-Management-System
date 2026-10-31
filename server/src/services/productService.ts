import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { createAuditLog } from '../utils/auditLog';

export class ProductService {
  static async listProducts(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const search = query.search ? String(query.search).trim() : undefined;
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;
    const type = query.type ? String(query.type) : undefined;

    const where: any = {
      ...(isActive !== undefined && { isActive }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { notes: { contains: search } },
        ],
      }),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: {
            where: { isActive: true },
          },
        },
      }),
    ]);

    return { products, total, page, limit };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async createProduct(data: any, userId?: string) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        type: data.type || 'SERVICE',
        salesPrice: data.salesPrice,
        costPrice: data.costPrice || 0,
        notes: data.notes,
        isActive: data.isActive ?? true,
      },
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_CREATED',
      entity: 'Product',
      entityId: product.id,
      details: product,
    });

    return product;
  }

  static async updateProduct(id: string, data: any, userId?: string) {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { variants: true },
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_UPDATED',
      entity: 'Product',
      entityId: id,
      details: data,
    });

    return product;
  }

  static async deleteProduct(id: string, userId?: string) {
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_DEACTIVATED',
      entity: 'Product',
      entityId: id,
    });

    return product;
  }

  // Variant operations
  static async listVariants(productId?: string) {
    return prisma.productVariant.findMany({
      where: {
        ...(productId && { productId }),
        isActive: true,
      },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async createVariant(data: any, userId?: string) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: data.productId,
        name: data.name,
        attributeName: data.attributeName,
        additionalPrice: data.additionalPrice || 0,
        isActive: data.isActive ?? true,
      },
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_VARIANT_CREATED',
      entity: 'ProductVariant',
      entityId: variant.id,
      details: variant,
    });

    return variant;
  }

  static async updateVariant(id: string, data: any, userId?: string) {
    const variant = await prisma.productVariant.update({
      where: { id },
      data,
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_VARIANT_UPDATED',
      entity: 'ProductVariant',
      entityId: id,
      details: data,
    });

    return variant;
  }

  static async deleteVariant(id: string, userId?: string) {
    const variant = await prisma.productVariant.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'PRODUCT_VARIANT_DEACTIVATED',
      entity: 'ProductVariant',
      entityId: id,
    });

    return variant;
  }
}

