#image static
resource "random_string" "s3_unique_key" {
  length  = 6
  upper   = false
  lower   = true
  number  = true
  special = false
}

data "aws_elb_service_account" "tf_elb_service_account" {}

resource "aws_s3_bucket" "s3_image_static_bucket" {
  bucket = "${var.project}-image-static-bucket-${random_string.s3_unique_key.result}"
  tags = {
    Name    = "${var.project}-image-static"
    Project = var.project
  }
}

# resource "aws_s3_bucket_acl" "s3_image_static_bucket" {
#   bucket = aws_s3_bucket.s3_image_static_bucket.id
#   acl    = "public-read"
# }
# resource "aws_s3_bucket_cors_configuration" "s3_image_static_bucket" {
#   bucket = aws_s3_bucket.s3_image_static_bucket.id

#   cors_rule {
#     allowed_origins = ["*"]
#     allowed_methods = ["GET"]
#     allowed_headers = ["*"]
#     max_age_seconds = 3000
#   }
# }

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

#LearningImage
resource "aws_s3_bucket" "s3_image_learn_bucket" {
  bucket = "${var.project}-image-learn-bucket-${random_string.s3_unique_key.result}"
  tags = {
    Name    = "${var.project}-image-learn"
    Project = var.project
  }
}

resource "aws_s3_bucket_acl" "s3_image_learn_bucket" {
  bucket = aws_s3_bucket.s3_image_learn_bucket.id
  acl    = "public-read"
}
resource "aws_s3_bucket_cors_configuration" "s3_image_learn_bucket" {
  bucket = aws_s3_bucket.s3_image_learn_bucket.id

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET"]
    allowed_headers = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_versioning" "versioning_image_learn" {
  bucket = aws_s3_bucket.s3_image_learn_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

# resource "aws_s3_bucket_public_access_block" "s3_image_learn_bucket" {
#   bucket                  = aws_s3_bucket.s3_image_learn_bucket.id
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = false
#   depends_on = [
#     aws_s3_bucket_policy.s3_image_learn_bucket
#   ]
# }

resource "aws_s3_bucket_policy" "s3_image_learn_bucket" {
  bucket = aws_s3_bucket.s3_image_learn_bucket.id
  policy = data.aws_iam_policy_document.s3_image_learn_bucket.json
}

data "aws_iam_policy_document" "s3_image_learn_bucket" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_image_learn_bucket.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = ["${aws_s3_bucket.s3_image_learn_bucket.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.ecs_task_role.arn]
    }
  }
}

#ALB_LOG_Buckets
resource "aws_s3_bucket" "s3_ALB_log_buckets" {
  bucket = "${var.project}-alb-log-bucket-${random_string.s3_unique_key.result}"
  tags = {
    Name    = "${var.project}-alb-log"
    Project = var.project
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "s3_ALB_log_buckets" {
  bucket = aws_s3_bucket.s3_ALB_log_buckets.id

  rule {
    id     = "log01"
    status = "Enabled"
    expiration {
      days = "180"
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_ALB_log_buckets" {
  bucket = aws_s3_bucket.s3_ALB_log_buckets.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "versioning_alb_log" {
  bucket = aws_s3_bucket.s3_ALB_log_buckets.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "s3_ALB_log_buckets" {
  bucket                  = aws_s3_bucket.s3_ALB_log_buckets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  depends_on = [
    aws_s3_bucket_policy.s3_ALB_log_buckets
  ]
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