/* 店舗の固定情報はこのファイルで変更します。 */
window.KATANO_CONFIG = {
  storeName: 'ENEOS 交野SS',
  operator: '北村石油株式会社',
  postalCode: '576-0017',
  address: '大阪府交野市星田北1-9-6',
  operatingType: 'セルフサービス',
  hours: {
    weekday: '7:30～19:30',
    holiday: '8:00～19:30'
  },
  company: {
    name: '北村石油株式会社',
    headOfficeAddress: '', // 正式な本社住所を確認後に入力
    phone: '', // 正式な会社電話番号を確認後に入力。店舗番号を本社番号として推測しない
    business: '石油製品販売・サービスステーション運営'
  },
  // ここは閲覧用の仮ログインです。ファイルだけのサイトでは安全な認証はできません。
  demoAdminPin: '2468',
  // 取扱サービスを変更する場合は、この配列を編集してください。
  services: [
    { id: 'drive-through-wash', name: 'ドライブスルー洗車', icon: '✧', description: 'ドライブスルー洗車をご利用いただけます。メニューや料金は店頭でご確認ください。' },
    { id: 'oil-change', name: 'オイル交換', icon: '◈', description: 'オイル交換に対応しています。作業内容や料金は店頭でご確認ください。' },
    { id: 'kerosene-delivery', name: '配達灯油', icon: '◇', description: '灯油の配達に対応しています。配達地域や受付方法は店頭でご確認ください。' }
  ]
};
