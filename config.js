/* 店舗の固定情報はこのファイルで変更します。 */
window.KATANO_CONFIG = {
  storeName: 'ENEOS 交野SS',
  operator: '北村石油株式会社',
  postalCode: '576-0017',
  address: '大阪府交野市星田北1-9-6',
  operatingType: 'セルフサービス',
  storePhone: '072-892-7070',
  hours: {
    weekday: '7:30～19:30',
    holiday: '8:00～19:30',
    closed: '1月1日のみ休業'
  },
  paymentMethods: ['現金', 'エネキー', 'クレジットカード', '電子マネー'],
  company: {
    name: '北村石油株式会社',
    business: '石油製品販売・サービスステーション運営'
  },
  // 取扱サービスを変更する場合は、この配列を編集してください。
  services: [
    {
      id: 'self-service-fueling',
      name: 'セルフサービスの給油',
      icon: '⛽',
      description: '給油はセルフサービスでご利用いただけます。'
    },
    {
      id: 'drive-through-wash',
      name: 'ドライブスルー洗車',
      icon: '✧',
      description: 'ドライブスルー洗車をご利用いただけます。',
      note: '対応できない車種：中型・大型トラック、外車、大型バイク等　ご不明な点はお問い合わせください。'
    },
    {
      id: 'oil-change',
      name: 'オイル交換',
      icon: '◈',
      description: 'オイル交換を承ります。',
      note: '作業できる従業員が不在の時間帯があるため、お電話でご予約の上お越しください。'
    },
    {
      id: 'fuel-delivery',
      name: '軽油・灯油の配達（法人・工場向け）',
      icon: '◇',
      description: '法人・工場等へ軽油・灯油を配達します。',
      noteStrong: '※個人宅への配達サービスは行っておりません。',
      note: '200ℓ以上から承ります。配達料が別途必要です（税込2,200円～）。配達可能エリア（交野・枚方・寝屋川・四條畷）。ご不明な点・詳細はお問い合わせください。'
    }
  ]
};
