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
    Name    = "${var.project}-web-sg"
    Project = var.project
  }
}

resource "aws_s3_bucket_versioning" "versioning_example" {
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