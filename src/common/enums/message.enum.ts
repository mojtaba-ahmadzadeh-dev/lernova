export enum PublicMessage {
  NotFoundAccount = "اکانت مورد نظر پیدا نشد",
  LoggedIn = "با موفقعیت وارد حساب کاربری خود شدید",
  Updated = "اطلاعات با موفقعیت ویرایش شد",
  NotFound = "اطلاعات مورد نظر یافت نشد",
  SendOTP = "کد تایید با موفقعیت ارسال شد",
  DeletedAccount = "اکانت کاربر با موفقعیت حذف شد",
  Created = "اطلاعات با موفقعیت ساخته شد",
}

export enum AuthMessages {
  INVALID_EMAIL = "فرمت ایمیل نامعتبر است",
  INVALID_MOBILE = "فرمت شماره موبایل نامعتبر است",
  USER_NOT_FOUND = "کاربر یافت نشد",
  OTP_NOT_FOUND = "کد تایید یافت نشد",
  OTP_EXPIRED = "کد تایید منقضی شده است",
  OTP_INVALID = "کد تایید نامعتبر است",
  LOGIN_SUCCESSFUL = "ورود با موفقیت انجام شد",
  OTP_SENT_SUCCESSFULLY = "کد با موفقیت ارسال شد",
  OTP_COOLDOWN = "تا ۲ دقیقه دیگر امکان دریافت کد جدید ندارید",
  INVALID_OTP = "فرمت کد تایید نامعتبر است",
  BOTH_EMAIL_OR_MOBILE_REQUIRED = "لطفا یک ایمیل یا شماره موبایل وارد کنید",
}

export enum UserMessages {
  USER_NOT_FOUND = "کاربر با آیدی مورد نظر یافت نشد",
  INVALID_ROLE = "نقش معتبر نیست",
  ROLE_UPDATED = "نقش کاربر با موفقیت تغییر یافت",
  USER_ALREADY_EXISTS = "کاربری با این مشخصات قبلاً ثبت‌نام کرده است",
  USER_BANNED = "کاربر با موفقیت مسدود شد",
  USER_UNBANNED = "کاربر از حالت مسدود خارج شد",
  USER_DELETED = "کاربر مورد نظر با موفقیت حذف شد",
}

export enum CategoryMessage {
  Created = "دسته بندی جدید با موفقعیت ساخته شد",
  Removed = "دسته بندی با موفقعیت حذف شد",
  Updated = "دسته بندی با موفقعیت اپدیت شد",
  NotFound = "دسته بندی مورد نظر پیدا نشد",
  InValidCategory = "لطفا دسته بندی مورد نظر را صحیح وارد کنید",
  InvalidParentId = "آیدی والد دسته بندی نامعتبر است",
}

export enum ConflictMessage {
  AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا وجود دارد",
  AlreadyEmail = "این ایمیل قبلا توسط شخصی دیگر استفاده شده",
  AlreadyPhone = "این شماره تلفن قبلا توسط شخصی دیگر استفاده شده",
  AlreadyCategory = "این دسته بندی قبلا ساخته شده",
  AlreadySlug = "این مسیر قبلا ساخته شده لطفا مسیر جدیدی را انتخاب کنید",
  AlreadyComment = "این کامنت قبلا ثبت شده",
}

export enum CourseMessage {
  Created = "دوره جدید با موفقعیت ساخته شد",
  AlreadyCourse = "همچین دوره ای قبل ثبت شده",
  NotFound = "دوره مورد نظر پیدا نشد",
  Removed = "دوره با موفقعیت حذف شد",
  Updated = "دوره با موفقعیت ویرایش شد",
}

export enum CommentMessage {
  Created = "کامنت شما با موفقعیت ثبت شد در صورت تایید نمایش داده خواهد شد",
  NotFound = "کامنت مورد نظر پیدا نشد",
  AlreadyRejecte = "کامنت قبلا توسط ادمین رد شده",
  AlreadyAccept = "کامنت قبلا توسط ادمین تایید شده",
  Apccepted = "نظر شما با موفقعیت تایید شد",
  Rejected = "نظر شما با موفقعیت رد شد",
  Remove = "نظر شما با موفقعیت حذف شد",
}

export enum ChapterMessage {
  Created = "سر فصل جدید با موفقعیت ساخته شد",
  NotFound = "سر فصل مورد نظر پیدا نشد",
  AleradyChapter = "سر فصل مورد نظر از قبل ساخته شده",
  Removed = "سر فصل مورد نظر با موفقعیت حذف شد",
  Updated = "سر فصل مورد نظر با موفقعیت آپدیت شد",
}

export enum SesstionMessage {
  uploaded = "جلسه جدید با موفقعیت اپلود شد",
  NotFound = "جلسه مورد نظر پیدا نشد",
  Deleted = "جلسه مورد نظر با موفقعیت حذف شد",
}

export enum BlogMessage {
  Created = "بلاگ جدید با موفقعیت ساخته شد",
  Updated = "بلاگ مورد نظر با موفقعیت اپدیت شد",
  Deleted = "بلاگ مورد نظر با موفقعیت حذف شد",
  NotFound = "همچین بلاگی وجود ندارد",
  AlreadyBlog = "این بلاگ قبلا ساخته شده",
  InValidStatus = "لطفا وضعیت مقاله را درست وارد کنید",
  changeStatus = "وضعیت بلاگ با موفقعیت تغییر کرد",
  Like = "بلاگ با موفقعیت لایک شد",
  DisLike = "لایک بلاگ برداشته شد",
  Bookmark = "بلاگ با موفقعیت ذخیره شد",
  UnBookmark = "بلاگ از لیست ذخیره پاک شد",
}

export enum DiscountMessage {
  ApplyDiscount = "کد تخفیف با موفقعیت اعمال شد",
  Created = "کد تخفیف جدید با موفقعیت ساخته شد",
  InValidDiscountField = "شما باید یکی از فیلد های مبلغ یا درصد را پر کنید",
  AlreadyDiscount = "این کد تخفیف قبلا ثبت شده",
  NotFound = "کد تخفیف مورد نظر پیدا نشد",
  Removed = "کد تخفیف مورد نظر با موفقعیت حذف شد",
  NotActive = "این کد تخفیف غیر فعال می باشد",
  UsegeLimit = "متاسفانه تعداد استفاده از این کد تخفیف به پایان رسیده است",
  Expires_code = "متاسفانه این کد تخفیف منقضی شده است",
  AlreadyUseDiscount = "شما در حال حاضر از این کد تخفیف استفاده کرده اید",
  AlreadyAppliedToCourse = "این تخفیف در حال حاضر برای دوره ثبت شده",
}

export enum BasketMessage {
  AddToBasket = "دوره با موفقعیت به سبد خرید شما اضافه شد",
  AlreadyCourse = "این دوره قبلا به سبد خرید شما اضافه شده",
  NotFound = "هیچ دوره ای در سبد خرید شما وجود ندارد",
  Removed = "دوره مورد نظر با موفقعیت از سبد خرید شما حذف شد",
}

export enum PaymentMessage {
  Success = "پرداخت با موفقیت انجام شد",
  Failed = "پرداخت ناموفق بود",
  AlreadyPaid = "این پرداخت قبلا ثبت شده است",
}

export enum OrderMessage {
  NotFound = "سفارش مورد نظر پیدا نشد",
}

export enum RbacMessages {
  ROLE_NOT_FOUND = "نقش مورد نظر پیدا نشد",
  PERMISSION_NOT_FOUND = "دسترسی مورد نظر پیدا نشد",
  PERMISSION_ALREADY_ASSIGNED = "این دسترسی قبلاً به نقش مورد نظر اختصاص داده شده است",
  PERMISSION_ASSIGNED_SUCCESSFULLY = "دسترسی با موفقیت به نقش اختصاص داده شد",
  PERMISSION_REMOVED_SUCCESSFULLY = "دسترسی با موفقیت از نقش حذف شد",
  ROLE_CREATED_SUCCESSFULLY = "نقش جدید با موفقیت ساخته شد",
  ROLE_UPDATED_SUCCESSFULLY = "نقش با موفقیت به‌روزرسانی شد",
  ROLE_DELETED_SUCCESSFULLY = "نقش با موفقیت حذف شد",
  ACCESS_DENIED = "شما دسترسی لازم برای این عملیات را ندارید",
  ALREADY_PERMISSION = "این دسترسی قبلا به نقش مورد نظر اختصاص داده شده است",
  NOTFOUND_ROLE = "نقش مورد نظر یافت نشد",
  NOTFOUND_PERMISSION = "دسترسی مورد نظر یافت نشد",
  PERMISSION_ALREADY_EXISTS = "این دسترسی قبلاً وجود دارد",
}
