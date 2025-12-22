/**
 * AWS EC2構築ガイド - コマンド生成ツール
 * 共通JavaScript関数
 */

// ========================================
// 汎用ユーティリティ関数
// ========================================

/**
 * クリップボードにテキストをコピー
 * @param {string} text - コピーするテキスト
 * @param {string} successElementId - 成功メッセージを表示する要素のID
 */
async function copyToClipboard(text, successElementId) {
  try {
    await navigator.clipboard.writeText(text);
    if (successElementId) {
      const elem = document.getElementById(successElementId);
      if (elem) {
        elem.textContent = '? コピーしました！';
        elem.style.display = 'inline';
        setTimeout(() => {
          elem.textContent = '';
          elem.style.display = 'none';
        }, 2000);
      }
    }
    return true;
  } catch (err) {
    console.error('コピー失敗:', err);
    alert('コピーに失敗しました。手動でコピーしてください。');
    return false;
  }
}

/**
 * 要素から値を取得
 * @param {string} elementId - 要素のID
 * @returns {string} 要素の値
 */
function getValue(elementId) {
  const elem = document.getElementById(elementId);
  return elem ? elem.value.trim() : '';
}

/**
 * 要素にテキストを設定
 * @param {string} elementId - 要素のID
 * @param {string} text - 設定するテキスト
 */
function setText(elementId, text) {
  const elem = document.getElementById(elementId);
  if (elem) {
    elem.textContent = text;
  }
}

// ========================================
// CloudFormationコマンド生成
// ========================================

/**
 * CloudFormationスタック作成コマンドを生成・更新
 */
function updateCreateStackCommand() {
  const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
  const templateFile = getValue('cfn-template-file') || 'template.yaml';
  const region = getValue('cfn-region') || 'ap-northeast-1';
  
  const command = `aws cloudformation create-stack \\
  --stack-name ${stackName} \\
  --template-body file://${templateFile} \\
  --region ${region} \\
  --capabilities CAPABILITY_IAM`;
  
  setText('cfn-create-command', command);
}

/**
 * CloudFormationスタック作成コマンドをコピー
 */
async function copyCreateStackCommand() {
  const command = document.getElementById('cfn-create-command').textContent;
  await copyToClipboard(command, 'cfn-create-success');
}

/**
 * CloudFormationスタック状態確認コマンドを生成・更新
 */
function updateDescribeStackCommand() {
  const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
  
  const command = `aws cloudformation describe-stacks \\
  --stack-name ${stackName} \\
  --query "Stacks[0].StackStatus"`;
  
  setText('cfn-describe-command', command);
}

/**
 * CloudFormationスタック状態確認コマンドをコピー
 */
async function copyDescribeStackCommand() {
  const command = document.getElementById('cfn-describe-command').textContent;
  await copyToClipboard(command, 'cfn-describe-success');
}

/**
 * CloudFormationスタック削除コマンドを生成・更新
 */
function updateDeleteStackCommand() {
  const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
  const region = getValue('cfn-region') || 'ap-northeast-1';
  
  const command = `aws cloudformation delete-stack \\
  --stack-name ${stackName} \\
  --region ${region}`;
  
  setText('cfn-delete-command', command);
}

/**
 * CloudFormationスタック削除コマンドをコピー
 */
async function copyDeleteStackCommand() {
  const command = document.getElementById('cfn-delete-command').textContent;
  await copyToClipboard(command, 'cfn-delete-success');
}

// ========================================
// EC2インスタンス操作コマンド生成
// ========================================

/**
 * インスタンス情報取得コマンドを生成・更新
 */
function updateInstanceCommands() {
  const instanceId = getValue('ec2-instance-id') || 'i-xxxxxxxxxxxxxxxxx';
  
  // パブリックIP取得
  const ipCommand = `aws ec2 describe-instances \\
  --instance-ids ${instanceId} \\
  --query "Reservations[0].Instances[0].PublicIpAddress" \\
  --output text`;
  setText('ec2-ip-command', ipCommand);
  
  // パブリックDNS取得
  const dnsCommand = `aws ec2 describe-instances \\
  --instance-ids ${instanceId} \\
  --query "Reservations[0].Instances[0].PublicDnsName" \\
  --output text`;
  setText('ec2-dns-command', dnsCommand);
  
  // インスタンス状態確認
  const stateCommand = `aws ec2 describe-instances \\
  --instance-ids ${instanceId} \\
  --query "Reservations[0].Instances[0].State.Name"`;
  setText('ec2-state-command', stateCommand);
}

/**
 * SSH接続コマンドを生成・更新
 */
function updateSSHCommand() {
  const keyFile = getValue('ssh-key-file') || 'my-ec2-test-key.pem';
  const publicIp = getValue('ssh-public-ip') || '<パブリックIP>';
  
  const command = `ssh -i ${keyFile} ec2-user@${publicIp}`;
  setText('ssh-command', command);
}

/**
 * SSH接続コマンドをコピー
 */
async function copySSHCommand() {
  const command = document.getElementById('ssh-command').textContent;
  await copyToClipboard(command, 'ssh-success');
}

// ========================================
// セキュリティグループ操作コマンド生成
// ========================================

/**
 * セキュリティグループコマンドを生成・更新
 */
function updateSecurityGroupCommands() {
  const sgId = getValue('sg-id') || 'sg-xxxxxxxxxxxxxxxxx';
  const myIp = getValue('sg-my-ip') || '0.0.0.0';
  
  // SSH全開放ルール削除
  const revokeSSH = `aws ec2 revoke-security-group-ingress \\
  --group-id ${sgId} \\
  --protocol tcp \\
  --port 22 \\
  --cidr 0.0.0.0/0`;
  setText('sg-revoke-ssh', revokeSSH);
  
  // HTTP全開放ルール削除
  const revokeHTTP = `aws ec2 revoke-security-group-ingress \\
  --group-id ${sgId} \\
  --protocol tcp \\
  --port 80 \\
  --cidr 0.0.0.0/0`;
  setText('sg-revoke-http', revokeHTTP);
  
  // SSH用ルール追加
  const authorizeSSH = `aws ec2 authorize-security-group-ingress \\
  --group-id ${sgId} \\
  --protocol tcp \\
  --port 22 \\
  --cidr ${myIp}/32`;
  setText('sg-authorize-ssh', authorizeSSH);
  
  // HTTP用ルール追加
  const authorizeHTTP = `aws ec2 authorize-security-group-ingress \\
  --group-id ${sgId} \\
  --protocol tcp \\
  --port 80 \\
  --cidr ${myIp}/32`;
  setText('sg-authorize-http', authorizeHTTP);
}

/**
 * セキュリティグループコマンドをコピー
 * @param {string} commandId - コマンドが表示されている要素のID
 * @param {string} successId - 成功メッセージを表示する要素のID
 */
async function copySGCommand(commandId, successId) {
  const command = document.getElementById(commandId).textContent;
  await copyToClipboard(command, successId);
}

// ========================================
// 初期化処理
// ========================================

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
  // CloudFormationコマンド初期化
  if (document.getElementById('cfn-stack-name')) {
    updateCreateStackCommand();
    updateDescribeStackCommand();
    updateDeleteStackCommand();
  }
  
  // EC2コマンド初期化
  if (document.getElementById('ec2-instance-id')) {
    updateInstanceCommands();
  }
  
  // SSHコマンド初期化
  if (document.getElementById('ssh-key-file')) {
    updateSSHCommand();
  }
  
  // セキュリティグループコマンド初期化
  if (document.getElementById('sg-id')) {
    updateSecurityGroupCommands();
  }
});