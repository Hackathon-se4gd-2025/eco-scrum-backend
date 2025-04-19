import { Document, Types } from 'mongoose';

export interface IEffectDetail extends Document {
  external_id: number;
  description: string;
  is_positive: boolean;
  likelihood: number;
  impact_level: number;
  order_of_impact: string;
  dimension_name: string;
  dimension_id: number;
  added_by_username: string;
  added_by_email: string;
  related_feature?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISustainabilityEffect extends Document {
  external_id: number;
  name: string;
  question: string;
  capture_id: number;
  effects: Types.ObjectId[] | IEffectDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRecommendation extends Document {
  threats: Record<string, string>;
  opportunities: Record<string, string>;
  recommendations: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Plain object versions (without Document inheritance) for use in DTOs and services
export interface EffectDetailDto {
  external_id: number;
  description: string;
  is_positive: boolean;
  likelihood: number;
  impact_level: number;
  order_of_impact: string;
  dimension_name: string;
  dimension_id: number;
  added_by_username: string;
  added_by_email: string;
  related_feature?: string;
}

export interface SustainabilityEffectDto {
  external_id: number;
  name: string;
  question: string;
  capture_id: number;
  effects: string[] | EffectDetailDto[];
}

export interface RecommendationDto {
  threats: Record<string, string>;
  opportunities: Record<string, string>;
  recommendations: Record<string, string>;
}