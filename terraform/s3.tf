#image static
resource "random_string" "s3_unique_key" {
  length  = 6
  upper   = false
  lower   = true
  number  = true
  special = false
}

resource "aws_s3_bucket" "s3_image_static_bucket" {
  bucket = "${var.project}-image-static-bucket-${random_string.s3_unique_key.result}"

  tags = {
    Name    = "${var.project}-image-static"
    Project = var.project
  }
}

resource "aws_s3_bucket_versioning" "versioning_image_static" {
  bucket = aws_s3_bucket.s3_image_static_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "s3_image_static_bucket" {
  bucket                  = aws_s3_bucket.s3_image_static_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = false
  depends_on = [
    aws_s3_bucket_policy.s3_image_static_bucket
  ]
}

resource "aws_s3_bucket_policy" "s3_image_static_bucket" {
  bucket = aws_s3_bucket.s3_image_static_bucket.id
  policy = data.aws_iam_policy_document.s3_image_static_bucket.json
}

data "aws_iam_policy_document" "s3_image_static_bucket" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_image_static_bucket.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

#ALB_LOG_Buckets

data "aws_elb_service_account" "tf_elb_service_account" {}
resource "aws_s3_bucket" "s3_ALB_log_buckets" {
  bucket = "${var.project}-alb-log-bucket-${random_string.s3_unique_key.result}"
  acl    = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  lifecycle_rule {
    enabled = true
    expiration {
      days = "180"
    }
  }
  tags = {
    Name    = "${var.project}-alb-log"
    Project = var.project
  }
}

resource "aws_s3_bucket_versioning" "versioning_alb_log" {
  bucket = aws_s3_bucket.s3_ALB_log_buckets.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_policy" "s3_ALB_log_buckets" {
  bucket = aws_s3_bucket.s3_ALB_log_buckets.id
  policy = data.aws_iam_policy_document.s3_ALB_log_buckets.json
}

data "aws_iam_policy_document" "s3_ALB_log_buckets" {
  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.s3_ALB_log_buckets.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_elb_service_account.tf_elb_service_account.id}:root"]
    }
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.s3_ALB_log_buckets.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "s3:x-amz-acl"
      values   = ["bucket-owner-full-control"]
    }

  }

  statement {
    effect    = "Allow"
    actions   = ["s3:GetBucketAcl"]
    resources = [aws_s3_bucket.s3_ALB_log_buckets.arn]
    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
  }
}