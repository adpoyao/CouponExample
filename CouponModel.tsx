import {
  IdentifiableReference,
  List,
  PaginatedList,
  PaginatedListOptions,
 } from "@coffee-now-app/data-model";
import { Inject } from "@coffee-now-app/inject";
import { Coupon, CouponGrant, CouponType } from "./Coupon";
import { CouponInstance } from "./CouponInstance";

export type CreateCouponParams<T extends CouponType = CouponType> = Omit<Coupon<T>, "id">;
export type UpdateCouponParams<T extends CouponType = CouponType> = Pick<Coupon, "id" | "type"> & (
  T extends "grant" ? Pick<Coupon<"grant">, "grants"> : { }
);
export type CreateCouponInstanceParams = Omit<CouponInstance, "id" | "createdAt" | "usageCount">;

export interface GetCouponInstanceListParams {
  customerId: string;
};

export type GetCouponListOptions<T extends CouponType = CouponType> = {
  limit?: number;
  type?: T;
} & (
  T extends "code" ? {
    code?: string;
  } : {}
) & (
  T extends "grant" ? {
    grant?: CouponGrant;
  } : {}
)

export function isGetCouponParamsOfType<T extends CouponType>(
  value: GetCouponListOptions,
  type: T,
): value is GetCouponListOptions<T> {
  return value.type === type;
}

export function isCreateCouponParamsOfType<T extends CouponType>(
  value: CreateCouponParams,
  type: T,
): value is CreateCouponParams<T> {
  return value.type === type;
}

export function isUpdateCouponParamsOfType<T extends CouponType>(
  value: UpdateCouponParams,
  type: T,
): value is UpdateCouponParams<T> {
  return value.type === type;
}

export abstract class CouponModel {
  static inject?: Inject<CouponModel>;

  // Coupon
  public abstract getCouponList(options?: GetCouponListOptions): List<Coupon>;
  public abstract getCouponRef(id: string): IdentifiableReference<Coupon>;
  public abstract createCoupon<T extends CouponType>(params: CreateCouponParams<T>): Promise<string>;
  public abstract deleteCoupon(id: string): Promise<void>;
  public abstract updateCoupon<T extends CouponType>(params: UpdateCouponParams<T>): Promise<void>;
  public abstract getNewUserCouponGrant(): Promise<Coupon | undefined>;

  // Coupon Instance
  public abstract createCouponInstance(params: CreateCouponInstanceParams): Promise<string>;
  public abstract getCouponInstanceRef(id: string): IdentifiableReference<CouponInstance>;
  public abstract getCouponInstanceList(params: GetCouponInstanceListParams): List<CouponInstance>;
  public abstract getCouponInstancePaginatedList(params: GetCouponInstanceListParams, options: PaginatedListOptions): PaginatedList<CouponInstance>;
  public abstract instantiateCouponFromCode(code: string): Promise<string>;
}