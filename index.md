---
layout: default
title: ホーム
nav_order: 1
description: "AWS初心者向けEC2構築手順書"
permalink: /
---

<!-- 共通CSS・JS読み込み -->
<!-- <link rel="stylesheet" href="../assets/css/style.css"> -->
<script src="./assets/js/command-generator.js"></script>

# AWS EC2構築ガイド
{: .fs-9 }

初心者向けのAWS EC2構築手順を紹介します。
{: .fs-6 .fw-300 }

[今すぐ始める](docs/preparation){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHub で見る](https://github.com/cayenne314-sys/aws-ec2-guide){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## このガイドについて

このガイドは、AWS初心者がEC2インスタンスを構築するための手順をまとめたものです。

* ローカル環境（VSCode）を使用
* CloudFormationテンプレートで構築
* Amazon Linux 2023を使用
* Apache httpdによる簡易Webサーバーを自動起動

---

## 📚 コンテンツ

### 準備

EC2インスタンスを構築する前に必要な準備を行います。

* [キーペア作成](docs/keypair) - SSH接続用のキーペアを作成

### 構築方法

実際にEC2インスタンスを構築します。

* [CloudFormation構築](docs/cloudformation) - VSCodeでテンプレートを使った構築

### ツール

AWS EC2構築に役立つツールとコマンドリファレンスを提供します。

* [コマンドリファレンス](docs/command-reference) - よく使うAWS CLIコマンドを簡単に生成

---

## 前提条件

このガイドを始める前に、以下を準備してください。

* ✅ AWSアカウントを作成済み
* ✅ AWS CLIをインストール済み
* ✅ VSCodeをインストール済み

---

## サポート

質問や問題がある場合は、[GitHub Issues](https://github.com/cayenne314-sys/aws-ec2-guide/issues)で報告してください。