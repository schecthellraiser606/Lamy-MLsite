terraform {
  required_version = ">=1.1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

#provider
provider "aws" {
  profile = var.username
  region  = "ap-northeast-1"
}

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