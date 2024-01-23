describe('顧客情報入力フォームのテスト', () => {
    it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
      cy.visit('/shoma_otsuka/customer/add.html'); // テスト対象のページにアクセス
      cy.window().then((win) => {
        // windowのalertをスタブ化し、エイリアスを設定
        cy.stub(win, 'alert').as('alertStub');
      });
  
      // テストデータの読み込み
      cy.fixture('customerData').then((data) => {
        // フォームの入力フィールドにテストデータを入力
        const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        cy.get('#companyName').type(data.companyName);
        cy.get('#industry').type(data.industry);
        cy.get('#contact').type(uniqueContactNumber);
        cy.get('#location').type(data.location);
      });
  
      // フォームの送信
      cy.wait(1000);
      cy.get('#confirmSubmit').click();
      cy.wait(2000);
      cy.get('#confirmButton').click();
      cy.wait(3000);
      // アラートメッセージが表示されることを確認する
      cy.on('window:alert', (message) => {
        expect(message).to.equal('顧客情報が正常に保存されました。');
      });
  
      // フォームがリセットされたことを確認
      cy.get('#companyName').should('have.value', '');
      cy.get('#industry').should('have.value', '');
      cy.get('#contact').should('have.value', '');
      cy.get('#location').should('have.value', '');
    });
  
    it('顧客リストを編集する', () => {
      cy.visit('/shoma_otsuka/customer/list.html'); // テスト対象のページにアクセス
      cy.window().then((win) => {
        // windowのalertをスタブ化し、エイリアスを設定
        cy.stub(win, 'alert').as('alertStub');
      });
      // 最後に登録した顧客情報をクリック後、編集ボタン押下
      cy.get('a[href^="detail.html?customer_id="]').last().click();
      cy.get('#editButton').click();
      cy.wait(3000);
      cy.get('#companyName').clear().type('サイプレステスト');
      cy.get('#industry').clear().type('自動テスト');
      cy.get('#contact').clear().type('999');
      cy.get('#location').clear().type('自動化テスト');
      cy.wait(2000);
  
      // 保存ボタンをクリック
      cy.get('button.btn-primary').click();
      // ポップアップダイアログの確認メッセージを持つカスタムコマンドを定義
      Cypress.Commands.add('confirmPopup', (message) => {
        cy.on('window:confirm', (str) => {
          expect(str).to.equal(message); // ポップアップのメッセージを検証
          return true; // OKをクリック
        });
      });
  
      // ポップアップダイアログの確認メッセージを検証し、OKボタンをクリックする
      cy.confirmPopup('情報を更新しました。'); // メッセージを実際のメッセージに合わせて調整
    });
  
    it('顧客リストを消去する', () => {
      cy.visit('/shoma_otsuka/customer/list.html'); // テスト対象のページにアクセス
      cy.window().then((win) => {
        // windowのalertをスタブ化し、エイリアスを設定
        cy.stub(win, 'alert').as('alertStub');
      });
      // 最後に登録した顧客情報をクリック後、削除ボタン押下
      cy.get('a[href^="detail.html?customer_id="]').last().click();
      cy.wait(1000);
      cy.get('#deleteButton').click();
      cy.wait(1000);
      // ポップアップダイアログの確認メッセージを持つカスタムコマンドを定義
      Cypress.Commands.add('confirmPopup', (message) => {
        cy.on('window:confirm', (str) => {
          expect(str).to.equal(message); // ポップアップのメッセージを検証
          return true; // OKをクリック
        });
      });
  
      // ポップアップダイアログの確認メッセージを検証し、OKボタンをクリックする
      cy.confirmPopup('削除していいですか？'); // メッセージを実際のメッセージに合わせて調整
      // ポップアップダイアログのOKボタンをクリックした後、メッセージを検証し、OKボタンを再度クリックする
      cy.on('window:alert', (str) => {
        expect(str).to.equal('削除されました。'); // メッセージを実際のメッセージに合わせて調整
      });
    });
  });
  