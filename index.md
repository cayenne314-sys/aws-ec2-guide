---
layout: default
title: ホーム
nav_order: 1
description: "AWS初心者向けEC2構築手順書"
permalink: /
---

# AWS EC2構築ガイド
{: .fs-9 }

初心者向けのAWS EC2構築手順を紹介します。
{: .fs-6 .fw-300 }

[今すぐ始める](docs/preparation){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHub で見る](https://github.com/cayenne314-sys/aws-ec2-guide){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## このガイドについて

このガイドは、AWS初心者がEC2インスタンスを構築するための手順をまとめたものです。

- ローカル環境（VSCode）を使用
- CloudFormationテンプレートで構築
- Amazon Linux 2023を使用
- Apache httpdによる簡易Webサーバーを自動起動

---

## 📚 目次

### 準備
- [キーペア作成](docs/keypair.md)

### 構築方法
- [VSCodeでCloudFormationテンプレートを使った構築](docs/cloudformation.md)

### ツール
- [CloudFormationコマンド生成ツール](tools/command-generator.html)

---

## このガイドについて

このガイドは、AWS初心者がEC2インスタンスを構築するための手順をまとめたものです。

- ローカル環境（VSCode）を使用
- CloudFormationテンプレートで構築
- Amazon Linux 2023を使用
- Apache httpdによる簡易Webサーバーを自動起動

---

## 前提条件

- AWSアカウントを作成済み
- AWS CLIをインストール済み
- VSCodeをインストール済み

---

最終更新: 2025年12月