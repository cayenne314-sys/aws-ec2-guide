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

// ========================================
// 動的パス置換機能
// ========================================

/**
 * 動的パス入力フィールドを初期化
 */
function initDynamicPaths() {
  // .dynamic-path クラスを持つすべての要素を処理
  document.querySelectorAll('.dynamic-path').forEach(container => {
    const input = container.querySelector('input[type="text"]');
    const codeBlock = container.querySelector('pre code, pre');
    
    if (!input || !codeBlock) return;
    
    // 初期値を保存（テンプレート）
    const template = codeBlock.textContent;
    
    // コピーボタンを追加
    if (!container.querySelector('.copy-btn')) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-small btn-primary copy-btn';
      copyBtn.textContent = '? コピー';
      copyBtn.style.marginTop = '8px';
      
      const successMsg = document.createElement('span');
      successMsg.className = 'copy-success';
      successMsg.style.marginLeft = '10px';
      
      copyBtn.addEventListener('click', async () => {
        await copyToClipboard(codeBlock.textContent, null);
        successMsg.textContent = '? コピーしました！';
        successMsg.style.display = 'inline';
        setTimeout(() => {
          successMsg.textContent = '';
          successMsg.style.display = 'none';
        }, 2000);
      });
      
      const btnContainer = document.createElement('div');
      btnContainer.appendChild(copyBtn);
      btnContainer.appendChild(successMsg);
      container.appendChild(btnContainer);
    }
    
    // 入力時にコードブロックを更新
    input.addEventListener('input', () => {
      codeBlock.textContent = input.value;
    });
    
    // 初期表示を更新
    codeBlock.textContent = input.value;
  });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // 既存の初期化...
  
  // 動的パス機能を初期化
  initDynamicPaths();
});

// ========================================
// パス組み立て機能
// ========================================

/**
 * パス組み立て機能を初期化
 */
function initPathBuilder() {
  // .path-builder クラスを持つコンテナを処理
  document.querySelectorAll('.path-builder').forEach(container => {
    const baseInput = container.querySelector('.input-base-path');
    const subInput = container.querySelector('.input-sub-path');
    
    if (!baseInput || !subInput) return;
    
    // グループIDを取得
    const groupId = container.dataset.group;
    if (!groupId) return;
    
    // 更新関数
    function updatePaths() {
      const basePath = baseInput.value.trim();
      const subPath = subInput.value.trim();
      
      // パスを組み合わせ（末尾の\を削除してから結合）
      const fullPath = basePath.replace(/\\+$/, '') + '\\' + subPath.replace(/^\\+/, '');
      
      // フルパス出力を更新
      const fullPathOutput = document.querySelector(`[data-path-output="${groupId}"]`);
      if (fullPathOutput) {
        const codeElem = fullPathOutput.querySelector('code') || fullPathOutput;
        codeElem.textContent = fullPath;
      }
      
      // cdコマンド出力を更新
      const cdOutput = document.querySelector(`[data-cd-output="${groupId}"]`);
      if (cdOutput) {
        const codeElem = cdOutput.querySelector('code') || cdOutput;
        codeElem.textContent = `cd "${fullPath}"`;
      }
      
      // mkdirコマンド出力を更新（もしあれば）
      const mkdirOutput = document.querySelector(`[data-mkdir-output="${groupId}"]`);
      if (mkdirOutput) {
        const codeElem = mkdirOutput.querySelector('code') || mkdirOutput;
        codeElem.textContent = `mkdir "${fullPath}"`;
      }
    }
    
    // 入力時に更新
    baseInput.addEventListener('input', updatePaths);
    subInput.addEventListener('input', updatePaths);
    
    // 初期表示
    updatePaths();
  });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // ...既存のコード
  
  // パス組み立て機能を初期化
  initPathBuilder();
});