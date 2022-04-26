#variables
variable "project" {
  type = string
}

variable "username" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_name" {
  type = string
}

variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}

variable "route53_domain" {
  type = string
}

variable "firebase_api_key" {
  type = string
}
variable "firebase_auth_domain" {
  type = string
}
variable "firebase_project_id" {
  type = string
}
variable "firebase_storage_bucket" {
  type = string
}
variable "firebase_messaging_sender_id" {
  type = number
}
variable "firebase_app_id" {
  type = string
}
variable "firebase_measurement_id" {
  type = string
}
