---
layout: default
title: コマンドリファレンス
parent: ツール
nav_order: 1
---

<!-- 共通CSS・JS読み込み -->
<!-- <link rel="stylesheet" href="../assets/css/style.css"> -->
<script src="../assets/js/command-generator.js"></script>

# AWSコマンドリファレンス
{: .fs-9 }

よく使うAWS CLIコマンドを簡単に生成できます。
{: .fs-6 .fw-300 }

<details markdown="1" class="toc-collapse">
<summary>📑 目次</summary>

{: .no_toc }

* TOC
{:toc}

</details>

---

## 📝 入力パラメータ

以下のパラメータを入力すると、自動的にコマンドが生成されます。

<div class="text-builder" data-group="params">

<div class="form-group">
  <label>スタック名:</label>
  <input type="text" data-var="STACK_NAME" value="my-stack">
  <small>CloudFormationスタックの名前</small>
</div>

<div class="form-group">
  <label>テンプレートファイル名:</label>
  <input type="text" data-var="TEMPLATE_FILE" value="template.yaml">
  <small>CloudFormationテンプレートファイル</small>
</div>

<div class="form-group">
  <label>リージョン:</label>
  <input type="text" data-var="REGION" value="ap-northeast-1">
  <small>AWSリージョン（東京: ap-northeast-1）</small>
</div>

<div class="form-group">
  <label>EC2インスタンスID:</label>
  <input type="text" data-var="INSTANCE_ID" value="" placeholder="i-xxxxxxxxxxxxxxxxx">
  <small>EC2インスタンスのID</small>
</div>

<div class="form-group">
  <label>セキュリティグループ名:</label>
  <input type="text" data-var="SG_NAME" value="my-security-group">
  <small>セキュリティグループの名前</small>
</div>

<div class="form-group">
  <label>セキュリティグループID:</label>
  <input type="text" data-var="SECURITY_GROUP_ID" value="" placeholder="sg-xxxxxxxxxxxxxxxxx">
  <small>セキュリティグループのID</small>
</div>

<div class="form-group">
  <label>キーペア名:</label>
  <input type="text" data-var="KEY_NAME" value="my-keypair">
  <small>EC2キーペアの名前</small>
</div>

<div class="form-group">
  <label>IAMロール名:</label>
  <input type="text" data-var="ROLE_NAME" value="my-ec2-role">
  <small>EC2用のIAMロール名</small>
</div>

<div class="form-group">
  <label>SSH接続元IP:</label>
  <input type="text" data-var="SSH_IP" value="0.0.0.0/0">
  <small>SSH(22番ポート)を許可するIP</small>
</div>

<div class="form-group">
  <label>HTTP接続元IP:</label>
  <input type="text" data-var="HTTP_IP" value="0.0.0.0/0">
  <small>HTTP(80番ポート)を許可するIP</small>
</div>

<div class="form-group">
  <label>インスタンス名:</label>
  <input type="text" data-var="INSTANCE_NAME" value="my-ec2-instance">
  <small>EC2インスタンスの名前</small>
</div>

<div class="form-group">
  <label>タグキー:</label>
  <input type="text" data-var="TAG_KEY" value="Environment">
  <small>コスト管理用タグのキー</small>
</div>

<div class="form-group">
  <label>タグ値:</label>
  <input type="text" data-var="TAG_VALUE" value="Production">
  <small>コスト管理用タグの値</small>
</div>

</div>

---

## 🔧 CloudFormation系コマンド

CloudFormationスタックの作成、確認、削除などのコマンドです。

### スタック作成
```batch
aws cloudformation create-stack --stack-name my-stack --template-body file://template.yaml --region ap-northeast-1 --capabilities CAPABILITY_IAM
```
{: data-output-group="cfn-commands" data-command-type="cfn-create"}
{: .wrap-code}

---

### スタック状態確認
```batch
aws cloudformation describe-stacks --stack-name my-stack --query "Stacks[0].StackStatus"
```
{: data-output-group="cfn-commands" data-command-type="cfn-describe"}
{: .wrap-code}

---

### インスタンスID取得
```batch
aws cloudformation describe-stacks --stack-name my-stack --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text
```
{: data-output-group="cfn-commands" data-command-type="cfn-get-instance-id"}
{: .wrap-code}

---

### スタック削除
```batch
aws cloudformation delete-stack --stack-name my-stack --region ap-northeast-1
```
{: data-output-group="cfn-commands" data-command-type="cfn-delete"}
{: .wrap-code}

---

## 🖥️ EC2インスタンス系コマンド

EC2インスタンスの起動、停止、状態確認などのコマンドです。

### インスタンス状態確認
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].State.Name"
```
{: data-output-group="ec2-commands" data-command-type="ec2-describe-state"}
{: .wrap-code}

---

### インスタンスステータス確認
```batch
aws ec2 describe-instance-status --instance-ids i-xxxxxxxxxxxxxxxxx --query "InstanceStatuses[0].InstanceStatus.Status"
```
{: data-output-group="ec2-commands" data-command-type="ec2-describe-status"}
{: .wrap-code}

---

### インスタンス停止
```batch
aws ec2 stop-instances --instance-ids i-xxxxxxxxxxxxxxxxx
```
{: data-output-group="ec2-commands" data-command-type="ec2-stop"}
{: .wrap-code}

---

### インスタンス起動
```batch
aws ec2 start-instances --instance-ids i-xxxxxxxxxxxxxxxxx
```
{: data-output-group="ec2-commands" data-command-type="ec2-start"}
{: .wrap-code}

---

### パブリックIP取得
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].PublicIpAddress" --output text
```
{: data-output-group="ec2-commands" data-command-type="ec2-get-public-ip"}
{: .wrap-code}

---

### パブリックDNS取得
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].PublicDnsName" --output text
```
{: data-output-group="ec2-commands" data-command-type="ec2-get-public-dns"}
{: .wrap-code}

---

## 🔒 セキュリティグループ系コマンド

セキュリティグループの確認と管理のコマンドです。

### セキュリティグループID取得
```batch
aws ec2 describe-security-groups --filters "Name=group-name,Values=my-security-group" --query "SecurityGroups[0].GroupId" --output text
```
{: data-output-group="sg-commands" data-command-type="sg-get-id"}
{: .wrap-code}

---

### セキュリティグループ詳細確認
```batch
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxxxxxxxxxx
```
{: data-output-group="sg-commands" data-command-type="sg-describe"}
{: .wrap-code}

---

## 📄 CloudFormationテンプレート生成

以下のパラメータでCloudFormationテンプレートを生成します。

<details markdown="1" open>
<summary>📄 <span data-text-template="{% raw %}{{TEMPLATE_FILE}}{% endraw %}">template.yaml</span></summary>
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'EC2 Instance with Amazon Linux 2023'
...
```
{: data-output-group="template" data-command-type="cloudformation-yaml"}

</details>

---

## 💡 使い方のヒント

### コマンドのコピー方法

各コードブロックの右上にあるコピーボタンをクリックすると、コマンドがクリップボードにコピーされます。

### 入力値の保存

ブラウザを閉じると入力値はリセットされます。よく使う値はメモ帳などに保存しておくことをおすすめします。

### エラーが出た場合

- インスタンスIDやセキュリティグループIDが正しいか確認
- リージョンが正しいか確認
- AWS CLIが正しく設定されているか確認

---

## 📚 関連ドキュメント

- [CloudFormation構築手順](../cloudformation) - 実際の構築手順
- [キーペア作成](../keypair) - SSH接続用のキーペア作成方法