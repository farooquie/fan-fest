import mongoose, { Schema, models, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "N/A" },
      country: { type: String, required: true },
      city: { type: String, default: "N/A" },
    },
    creatorProfile: {
      handle: { type: String, required: true },
      niche: { type: String, required: true },
      platforms: { type: [String], default: [] },
      followerCount: { type: String, required: true },
      avgViews: { type: String, default: "N/A" },
      profileLinks: { type: [String], default: [] },
    },
    participationPreferences: {
      panel: { type: Boolean, default: false },
      meetAndGreet: { type: Boolean, default: false },
      collabs: { type: Boolean, default: false },
      brandDeals: { type: Boolean, default: false },
      liveChallenges: { type: Boolean, default: false },
    },
    additionalDetails: {
      bio: { type: String, required: true },
      previousEventExperience: { type: String, default: "" },
      referralSource: { type: String, default: "" },
    },
    consents: {
      termsAndConditions: { type: Boolean, required: true },
      mediaConsent: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export type ApplicationDocument = mongoose.InferSchemaType<
  typeof ApplicationSchema
> & { _id: mongoose.Types.ObjectId };

export const Application =
  models.Application || model("Application", ApplicationSchema);
