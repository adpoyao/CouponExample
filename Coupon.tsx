import { Identifiable } from "@coffee-now-app/data-model";
import { isBefore } from "date-fns";
import { Deletable } from "./Deletable";
import { formatDiscount } from "./Discount";
import { isNumberFragmentOfType, NumberFragment } from "./NumberFragment";

export const couponTypes = ["code", "grant"] as const;
export type CouponType = typeof couponTypes[number];

export const couponGrants = ["newUser", "referral"] as const;
export type CouponGrant = typeof couponGrants[number];

export type Coupon<T extends CouponType = CouponType> = Identifiable & Deletable & Readonly<{
  type: T;
  discount: NumberFragment;
  usageMaximum: number | undefined;
} & (
  T extends "code" ? {
    code: string;
    expiresAt: Date;
  } : { }
) & (
  T extends "grant" ? {
    expiresAfterDays: number;
    grants: ReadonlyArray<CouponGrant>;
  } : { }
)>;

export function isCouponOfType<T extends CouponType>(
  coupon: Coupon,
  type: T,
): coupon is Coupon<T> {
  return coupon.type === type;
}

export function couponIsInstantiable(coupon: Coupon, now: Date): boolean {
  return (
    !coupon.isDeleted &&
    (isCouponOfType(coupon, "code") ? isBefore(now, coupon.expiresAt) : true)
  );
}

export function isValidCouponCode(code: string): boolean {
  return /^[A-Z0-9]+$/.test(code);
}

export function sanitizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function couponHasGrant(coupon: Coupon, grant: CouponGrant): boolean {
  return isCouponOfType(coupon, "grant") && coupon.grants.includes(grant);
}

export function formatCouponValue(coupon: Coupon): string {
  const discountString = formatDiscount(coupon.discount);
  if (isNumberFragmentOfType(coupon.discount, "percentage")) {
    return `${discountString} your entire order`;
  }
  return `${discountString} your order`;
}
