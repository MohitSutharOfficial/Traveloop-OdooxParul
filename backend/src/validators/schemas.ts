import Joi from 'joi';

// ─── Profiles ────────────────────────────────────────────
export const updateProfileSchema = Joi.object({
  first_name: Joi.string().max(120),
  last_name: Joi.string().max(120),
  phone: Joi.string().max(40).allow('', null),
  city: Joi.string().max(120).allow('', null),
  country: Joi.string().max(120).allow('', null),
  preferred_travel_style: Joi.string().valid('adventure', 'relaxation', 'cultural', 'business'),
  avatar_url: Joi.string().uri().allow('', null),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

export const updateAdminUserSchema = Joi.object({
  first_name: Joi.string().max(120),
  last_name: Joi.string().max(120),
  city: Joi.string().max(120).allow('', null),
  country: Joi.string().max(120).allow('', null),
  is_admin: Joi.boolean(),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

export const createAdminUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().max(120).required(),
  last_name: Joi.string().max(120).required(),
  city: Joi.string().max(120).allow('', null),
  country: Joi.string().max(120).allow('', null),
  is_admin: Joi.boolean().default(false),
}).options({ stripUnknown: true });

// ─── Destinations ────────────────────────────────────────
export const createDestinationSchema = Joi.object({
  name: Joi.string().max(160).required(),
  country: Joi.string().max(160).required(),
  region: Joi.string().max(160).allow('', null),
  image_url: Joi.string().uri().allow('', null),
  description: Joi.string().allow('', null),
  average_daily_budget: Joi.number().positive().allow(null),
}).options({ stripUnknown: true });

// ─── Trips ───────────────────────────────────────────────
export const createTripSchema = Joi.object({
  name: Joi.string().max(180).required(),
  destination: Joi.string().max(180).required(),
  cover_photo: Joi.string().uri().allow('', null),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
  status: Joi.string().valid('draft', 'upcoming', 'active', 'completed', 'cancelled').default('draft'),
  budget_total: Joi.number().min(0).default(0),
  currency: Joi.string().length(3).default('USD'),
}).options({ stripUnknown: true });

export const updateTripSchema = Joi.object({
  name: Joi.string().max(180),
  destination: Joi.string().max(180),
  cover_photo: Joi.string().uri().allow('', null),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
  status: Joi.string().valid('draft', 'upcoming', 'active', 'completed', 'cancelled'),
  planning_score: Joi.number().min(0).max(100),
  budget_total: Joi.number().min(0),
  budget_spent: Joi.number().min(0),
  currency: Joi.string().length(3),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

// ─── Itinerary Items ─────────────────────────────────────
export const createItineraryItemSchema = Joi.object({
  trip_id: Joi.string().uuid().required(),
  item_type: Joi.string().valid('flight', 'hotel', 'activity', 'meal', 'transfer', 'note').required(),
  title: Joi.string().max(180).required(),
  location: Joi.string().max(180).allow('', null),
  starts_at: Joi.date().iso().allow(null),
  ends_at: Joi.date().iso().allow(null),
  notes: Joi.string().allow('', null),
  cost: Joi.number().min(0).default(0),
  sort_order: Joi.number().integer().default(0),
}).options({ stripUnknown: true });

export const updateItineraryItemSchema = Joi.object({
  item_type: Joi.string().valid('flight', 'hotel', 'activity', 'meal', 'transfer', 'note'),
  title: Joi.string().max(180),
  location: Joi.string().max(180).allow('', null),
  starts_at: Joi.date().iso().allow(null),
  ends_at: Joi.date().iso().allow(null),
  notes: Joi.string().allow('', null),
  cost: Joi.number().min(0),
  sort_order: Joi.number().integer(),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

// ─── Activities ──────────────────────────────────────────
export const createActivitySchema = Joi.object({
  destination_id: Joi.string().uuid().allow(null),
  name: Joi.string().max(180).required(),
  category: Joi.string().max(120).allow('', null),
  description: Joi.string().allow('', null),
  price_from: Joi.number().min(0).allow(null),
  rating: Joi.number().min(0).max(5).allow(null),
  image_url: Joi.string().uri().allow('', null),
}).options({ stripUnknown: true });

// ─── Packing Items ───────────────────────────────────────
export const createPackingItemSchema = Joi.object({
  trip_id: Joi.string().uuid().required(),
  label: Joi.string().max(160).required(),
  category: Joi.string().max(120).allow('', null),
  sort_order: Joi.number().integer().default(0),
}).options({ stripUnknown: true });

export const updatePackingItemSchema = Joi.object({
  label: Joi.string().max(160),
  category: Joi.string().max(120).allow('', null),
  is_packed: Joi.boolean(),
  sort_order: Joi.number().integer(),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

// ─── Trip Notes ──────────────────────────────────────────
export const createTripNoteSchema = Joi.object({
  trip_id: Joi.string().uuid().required(),
  title: Joi.string().max(180).required(),
  body: Joi.string().allow('', null),
}).options({ stripUnknown: true });

export const updateTripNoteSchema = Joi.object({
  title: Joi.string().max(180),
  body: Joi.string().allow('', null),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

// ─── Invoices ────────────────────────────────────────────
export const createInvoiceSchema = Joi.object({
  trip_id: Joi.string().uuid().required(),
  invoice_number: Joi.string().max(80).required(),
  status: Joi.string().valid('draft', 'issued', 'paid', 'void').default('draft'),
  currency: Joi.string().length(3).default('USD'),
  total: Joi.number().min(0).default(0),
  issued_at: Joi.date().iso().allow(null),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().max(220).required(),
      amount: Joi.number().min(0).required(),
    }).options({ stripUnknown: true })
  ).allow(null),
}).options({ stripUnknown: true });

export const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('draft', 'issued', 'paid', 'void'),
  total: Joi.number().min(0),
  issued_at: Joi.date().iso().allow(null),
  paid_at: Joi.date().iso().allow(null),
}).options({ stripUnknown: true }).min(1).options({ stripUnknown: true });

// ─── Community Posts ─────────────────────────────────────
export const createCommunityPostSchema = Joi.object({
  title: Joi.string().max(180).required(),
  body: Joi.string().required(),
  destination: Joi.string().max(180).allow('', null),
  image_url: Joi.string().uri().allow('', null),
}).options({ stripUnknown: true });

// ─── Pagination / ID ─────────────────────────────────────
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}).options({ stripUnknown: true });

export const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
}).options({ stripUnknown: true });
