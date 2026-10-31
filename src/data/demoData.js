const soupImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900'
const mealImage = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900'
const make = (id, ru, uz, category, price, halfPrice = null, unit = '1 порция') => ({
  id, name_ru: ru, name_uz: uz, description_ru: unit, description_uz: unit,
  category, price, half_price: halfPrice, image_url: category === 'Супы' ? soupImage : category === 'Гарниры' ? 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900' : mealImage,
  available: true
})
export const demoProducts = [
  make('a67f0638-9eb2-5c67-8cec-5f8402b3ee10','Мошхурда','Moshxo‘rda','Супы',30000,25000,'0,5 / 1 порция'),
  make('989d0875-1594-5bf7-b1c6-23d772257460','Мохора','Moxora','Супы',30000,25000,'0,5 / 1 порция'),
  make('a4896356-249f-5526-99fa-c141caccb0a7','Мастава','Mastava','Супы',30000,25000,'0,5 / 1 порция'),
  make('c89c8d60-4e30-52d0-8f37-003a123022ca','Кайнатма шурпа','Qaynatma sho‘rva','Супы',35000,null,'1 порция'),
  make('71827a61-b576-5848-b1a1-edf4b47bd93d','Лагман','Lag‘mon','Супы',30000,28000,'0,5 / 1 порция'),
  make('93af7b4b-3486-5d14-a15d-f8853bf60df1','Борщ','Borsh','Супы',33000,25000,'0,5 / 1 порция'),
  make('afc44330-6c68-5765-a0de-ac3b68a8bd73','Ош (туй)','To‘y oshi','Основные блюда',30000,25000,'0,5 / 1 порция'),
  make('2910b531-2b8a-5411-b788-fc0b9d3723bd','Ковурма лагман','Qovurma lag‘mon','Основные блюда',30000,null,'1 порция'),
  make('def55015-78ba-52f5-9b01-edd8f1663151','Товук гушт кузи корин 6-н','Tovuq go‘shtli taom (menyuda)','Основные блюда',30000,null,'1 порция'),
  make('eef365a2-3b5f-5498-b59c-59dc393fd13a','Товук гушт сабзавот 6-н','Tovuq go‘shtli sabzavot','Основные блюда',30000,null,'1 порция'),
  make('a3e8ca76-7047-5f7c-8725-46e420db1d9e','Бифштекс котлет (75 г)','Bifshteks kotlet (75 g)','Основные блюда',11000,null,'1 шт. / 75 г'),
  make('7d704687-bf0f-50c2-845d-d8525c9d3cf4','Карам дулма','Karam do‘lma','Основные блюда',8000,null,'1 шт.'),
  make('a6d7c94d-60ef-518a-ba07-7549fc23ea3a','Ток дулма','Tok do‘lma','Основные блюда',6000,null,'1 шт.'),
  make('fcca74c7-b732-56f2-bd79-ddc512a298ce','Болгар дулма','Bolgar do‘lma','Основные блюда',40000,null,'1 порция'),
  make('36827842-2f01-528f-b407-251aabcd1ac0','Манты','Manti','Основные блюда',10000,null,'1 шт.'),
  make('8b141b94-9c32-5d78-8b65-c0362186586c','Хоним','Xonim','Основные блюда',7000,null,'1 шт.'),
  make('974c20db-ad90-5d72-89fc-4c977e495b49','Куй гушт казон кабоб','Qo‘y go‘shtidan qozon kabob','Основные блюда',60000,null,'1 порция'),
  make('0f4ff2b5-72ef-58de-aea8-03f215e23d66','Жаркое','Jarkoye','Основные блюда',35000,null,'1 порция'),
  make('d07ca749-3f41-5348-a73f-831fdaf2984c','Товукли казон кабоб','Tovuqli qozon kabob','Основные блюда',40000,null,'1 порция'),
  make('c105c9ce-5838-560c-ba8e-0f4936ff9a1f','Катле сабзавот билан','Sabzavotli kotlet','Основные блюда',35000,null,'1 шт.'),
  make('13767ebf-05ef-5e8d-ab65-4b02e7f44968','Жигар картошка билан','Kartoshkali jigar','Основные блюда',30000,null,'1 порция'),
  make('161a15f0-e166-59f7-9f25-e945c5b47106','Мошкири','Moshkichiri','Основные блюда',30000,null,'1 порция'),
  make('4c9b5823-a66c-51f7-be64-00e6e80d68c8','Киевский котлет','Kiyev kotleti','Основные блюда',20000,null,'1 шт.'),
  make('17ec2bb0-90f3-5343-8e73-f8c8d524244b','Спагетти','Spagetti','Основные блюда',30000,null,'1 порция'),
  make('14c74b7c-5bc3-5794-bea6-22a82740581a','Кайнатилган гречка','Qaynatilgan grechka','Гарниры',4000,null,'100 г'),
  make('a38788fc-9f68-5540-9ec3-fa5afd437ccd','Кайнатилган перловка','Qaynatilgan perlovka','Гарниры',4000,null,'100 г'),
  make('a14ff129-2f0c-51a2-89f3-b835b6bb945d','Картошка пюре','Kartoshka pyuresi','Гарниры',4000,null,'100 г'),
  make('c88b4550-97b7-5b5f-9d45-42e4dd33c452','Кайнатилган макарон','Qaynatilgan makaron','Гарниры',4000,null,'100 г'),
  make('ba0c5cee-b850-5c54-9aa7-4e42d9e4f213','Кайнатилган горох','Qaynatilgan no‘xat','Гарниры',4000,null,'100 г'),
  make('f2fb1aaf-7e1d-53ab-8d05-db2018c486a2','Кайнатилган гуруч','Qaynatilgan guruch','Гарниры',4000,null,'100 г'),
  make('fa3f1295-4a36-5514-a38e-08da7371db77','Ковурилган тухум','Qovurilgan tuxum','Гарниры',4000,null,'1 шт.')
]
export const demoCategories = ['Все блюда','Супы','Основные блюда','Гарниры']
export const demoSlots = ['10:20','11:10','12:00','12:50','13:40']
export const formatMoney = value => new Intl.NumberFormat('ru-RU').format(value) + ' сум'
