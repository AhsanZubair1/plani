export const ERROR_MESSAGES = {
  ALREADY_EXISTS: (key: string) => `${key} already exists`,
  INCORRECT: (key: string) => `${key} is incorrect`,
  INCORRECT_CREDENTIAL: 'The user enters the invalid credentials',
  INCORRECT_EMAIL: 'The user does not exist or the email is incorrect',
  INCORRECT_PASSWORD: 'The password is incorrect',
  NOT_PRESENT: (key: string) => `${key} is not present`,
  INVALID_OTP: 'The OTP is invalid or has expired',
  USER_NOT_FOUND: 'User not found',
};

export const GEN_AI_CONFIGURATION_ERROR = `Google Generative AI is not configured properly.`;
export const NOT_FOLLOWING_ERROR = 'You are not following this user.';
export const ALREADY_FOLLOWING_ERROR = 'You are already following this user.';
export const SELF_ACTION_ERROR = 'You cannot perform this action on yourself.';
export const USER_ID_REQUIRED = 'User ID is required';
export const NOTIFICATION_FETCH_ERROR = 'Failed to retrieve notifications';
export const NOTIFICATION_ID_REQUIRED = 'Notification ID is required';
export const FAILED_TO_UPLOAD_PROFILE_PICTURE =
  'Failed to upload profile picture';
export const NOTIFICATION_UPDATE_ERROR =
  'Failed to update notification read status';
export const NOTIFICATION_MARK_ALL_READ_ERROR =
  'Failed to mark all notifications as read';
export const NO_PROFILE_PICTURE_PROVIDED = 'No profile picture provided';

export const ARTICLE_NOT_FAVORITE_ERROR =
  'Article already removed from favorite articles';
export const ARTICLE_ALREADY_FAVORITED_ERROR =
  'Article already added to favorite articles';
export const ENABLE_BIOMETRIC_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while enabling biometric for userId: ${userId} & deviceId: ${deviceId}`;
export const DISABLE_BIOMETRIC_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while disabling biometric for userId: ${userId} & deviceId: ${deviceId}`;
export const BIOMETRIC_CHALLENGE_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while getting biometric challenge for userId: ${userId} & deviceId: ${deviceId}`;
export const BIOMETRIC_VERIFICATION_FAILED = `Biometric verification failed.`;
export const ERROR_BIOMETRIC_VERIFICATION = `Error during Biometric verification.`;

export const OTP_VERIFICATION_FAILED = `User enters the wrong OTP`;
export const PASSWORD_CRITERIA_FAILED = `User tries to create a password that doesn't meet the criteria`;
export const USER_DOCUMENT_UNPROCESSABLE = `User submits an unclear or invalid ID card image`;
export const FAMILY_MEMBER_ERRORS = {
  MYKAD_ID_EXISTS: (mykadId: string) =>
    `Family member with MyKad ID ${mykadId} already exists`,
  PRIMARY_MEMBER_EXISTS: (inviterId: string) =>
    `A primary family member already exists for inviter ${inviterId}. Only one primary member is allowed.`,
  USER_WITH_MYKAD_EXISTS: (mykadId: string) =>
    `Cannot delete family member as MyKad ID ${mykadId} is associated with a user account`,
  USER_WITH_PHONE_EXISTS: (phoneNumber: string) =>
    `A family member already exists for phone ${phoneNumber} `,
  NOT_FOUND: (field: string, value: string) =>
    `Family member with ${field} ${value} not found`,
  METHOD_NOT_FOUND: (method: string, field: string) =>
    `Method ${method} not found on family member repository for field ${field}`,
  PRIMARY_MEMBER_NOT_ALLOWED: `Creation of primary member not allowed`,
  MEMBER_NOT_CREATED: `Not Allowed to create family member`,
};

export const GOVERNMENT_CONNECT_ERRORS = {
  MESSAGE_NOT_FOUND: (id: string) =>
    `Government connect message with ID ${id} not found`,
  MESSAGE_ALREADY_EXISTS: (url: string) =>
    `A message with URL ${url} already exists`,
  INVALID_MESSAGE_TYPE: 'Invalid message type provided',
  INVALID_MESSAGE_STATUS: 'Invalid message status provided',
  INVALID_DATE_RANGE: 'Invalid date range provided',
  INVALID_AUDIENCE: 'Invalid audience configuration provided',
  AUDIENCE_REQUIRED: 'Audience is required for direct line messages',
  USER_NOT_FOUND: (id: string) => `User with ID ${id} not found`,
  CATEGORY_NOT_FOUND: (id: string) => `Category with ID ${id} not found`,
  ARTICLE_NOT_FOUND: (id: string) => `Article with ID ${id} not found`,
  VIDEO_NOT_FOUND: (id: string) => `Video with ID ${id} not found`,
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  INVALID_PAGINATION: 'Invalid pagination parameters provided',
  INVALID_FILTERS: 'Invalid filter parameters provided',
  MESSAGE_CREATION_FAILED: 'Failed to create government connect message',
  MESSAGE_UPDATE_FAILED: 'Failed to update government connect message',
  MESSAGE_DELETION_FAILED: 'Failed to delete government connect message',
  MESSAGE_STATUS_UPDATE_FAILED: 'Failed to update message status',
  INVALID_ASSET_ID: 'Invalid asset ID provided',
  INVALID_TITLE: 'Invalid title provided',
  INVALID_USER_CATEGORY: 'Invalid user category provided',
  INVALID_ARMED_FORCE_BRANCH: 'Invalid armed force branch provided',
  MESSAGE_PERMISSION_CREATION_FAILED: 'Failed to create message permissions',
  MESSAGE_PERMISSION_UPDATE_FAILED: 'Failed to update message permissions',
  MESSAGE_PERMISSION_DELETION_FAILED: 'Failed to delete message permissions',
  INVALID_MESSAGE_CONTENT: 'Invalid message content provided',
  INVALID_MESSAGE_METADATA: 'Invalid message metadata provided',
  MESSAGE_ARCHIVAL_FAILED: 'Failed to archive message',
  MESSAGE_PUBLISH_FAILED: 'Failed to publish message',
  MESSAGE_DRAFT_FAILED: 'Failed to save message as draft',
  MESSAGE_APPROVAL_FAILED: 'Failed to approve message',
  MESSAGE_REJECTION_FAILED: 'Failed to reject message',
  MESSAGE_RETRIEVAL_FAILED: 'Failed to retrieve messages',
  INVALID_SORT_PARAMETERS: 'Invalid sort parameters provided',
  INVALID_SEARCH_PARAMETERS: 'Invalid search parameters provided',
  MESSAGE_DUPLICATE_CONTENT: 'Message content already exists',
  MESSAGE_INVALID_STATE_TRANSITION: 'Invalid message state transition',
  MESSAGE_EXPIRED: 'Message has expired',
  MESSAGE_NOT_APPROVED: 'Message is not approved',
  MESSAGE_NOT_PUBLISHED: 'Message is not published',
  MESSAGE_NOT_DRAFT: 'Message is not in draft state',
  MESSAGE_NOT_ARCHIVED: 'Message is not archived',
  MESSAGE_NOT_PENDING_APPROVAL: 'Message is not pending approval',
  MESSAGE_NOT_REJECTED: 'Message is not rejected',
  MESSAGE_NOT_ACTIVE: 'Message is not active',
  MESSAGE_NOT_INACTIVE: 'Message is not inactive',
  MESSAGE_NOT_DELETED: 'Message is not deleted',
  MESSAGE_NOT_RESTORED: 'Message is not restored',
  MESSAGE_NOT_LOCKED: 'Message is not locked',
  MESSAGE_NOT_UNLOCKED: 'Message is not unlocked',
  MESSAGE_NOT_SCHEDULED: 'Message is not scheduled',
  MESSAGE_NOT_UNSCHEDULED: 'Message is not unscheduled',
  MESSAGE_NOT_PINNED: 'Message is not pinned',
  MESSAGE_NOT_UNPINNED: 'Message is not unpinned',
  MESSAGE_NOT_FEATURED: 'Message is not featured',
  MESSAGE_NOT_UNFEATURED: 'Message is not unfeatured',
  MESSAGE_NOT_HIGHLIGHTED: 'Message is not highlighted',
  MESSAGE_NOT_UNHIGHLIGHTED: 'Message is not unhighlighted',
  MESSAGE_NOT_PROMOTED: 'Message is not promoted',
  MESSAGE_NOT_UNPROMOTED: 'Message is not unpromoted',
  MESSAGE_NOT_SPONSORED: 'Message is not sponsored',
  MESSAGE_NOT_UNSPONSORED: 'Message is not unsponsored',
  MESSAGE_NOT_ENDORSED: 'Message is not endorsed',
  MESSAGE_NOT_UNENDORSED: 'Message is not unendorsed',
  MESSAGE_NOT_VERIFIED: 'Message is not verified',
  MESSAGE_NOT_UNVERIFIED: 'Message is not unverified',
  MESSAGE_NOT_FLAGGED: 'Message is not flagged',
  MESSAGE_NOT_UNFLAGGED: 'Message is not unflagged',
  MESSAGE_NOT_REPORTED: 'Message is not reported',
  MESSAGE_NOT_UNREPORTED: 'Message is not unreported',
  MESSAGE_NOT_BLOCKED: 'Message is not blocked',
  MESSAGE_NOT_UNBLOCKED: 'Message is not unblocked',
  MESSAGE_NOT_MUTED: 'Message is not muted',
  MESSAGE_NOT_UNMUTED: 'Message is not unmuted',
  MESSAGE_NOT_HIDDEN: 'Message is not hidden',
  MESSAGE_NOT_UNHIDDEN: 'Message is not unhidden',
  MESSAGE_NOT_UNARCHIVED: 'Message is not unarchived',
  MESSAGE_NOT_UNDELETED: 'Message is not undeleted',
  MESSAGE_NOT_UNRESTORED: 'Message is not unrestored',
};
