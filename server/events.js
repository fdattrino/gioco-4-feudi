const events = [
  {
    id: 1,
    name: 'Incursione degli Ungari',
    grain: -50,
    knights: -1,
    peasants: 0,
    productiveManors: 0,
    protectedByFortification: true
  },
  {
    id: 2,
    name: 'Grande incursione degli Ungari',
    grain: -200,
    knights: -2,
    peasants: -10,
    productiveManors: -2,
    protectedByFortification: true
  },
  {
    id: 3,
    name: 'Scorreria di briganti',
    grain: -50,
    knights: -1,
    peasants: -5,
    productiveManors: -1,
    protectedByFortification: true
  },
  {
  id: 4,
  name: 'Carestia',
  grain: -200,
  knights: 0,
  peasants: 0,
  productiveManors: 0,
  protectedByFortification: false
 },
 {
  id: 5,
  name: 'Alluvione',
  grain: -200,
  knights: 0,
  peasants: 0,
  productiveManors: 0,
  protectedByFortification: false
},
{
  id: 6,
  name: 'Lupi',
  grain: -100,
  knights: 0,
  peasants: 0,
  productiveManors: 0,
  protectedByFortification: false
},
{
  id: 7,
  name: 'Epidemia',
  grain: 0,
  knights: 0,
  peasants: -30,
  productiveManors: -6,
  protectedByFortification: false
},
{
  id: 8,
  name: 'Epidemia lieve',
  grain: 0,
  knights: 0,
  peasants: -10,
  productiveManors: -2,
  protectedByFortification: false
},
{
  id: 9,
  name: 'Contadini che chiedono protezione tipo 1',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 10,
  name: 'Prigioniera - Riscatto',
  grain: -300,
  knights: 0,
  peasants: 0,
  productiveManors: 0,
  protectedByFortification: false
},
{
  id: 11,
  name: 'Bottino di guerra',
  grain: 500,
  knights: 0,
  peasants: 0,
  productiveManors: 0,
  protectedByFortification: false
},

{
  id: 12,
  name: 'Contadini che chiedono protezione tipo 2',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 13,
  name: 'Contadini che chiedono protezione tipo 3',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 14,
  name: 'Contadini che chiedono protezione tipo 4',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 15,
  name: 'Contadini che chiedono protezione tipo 5',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 16,
  name: 'Contadini che chiedono protezione tipo 6',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiresProtection: true,
  protectedByFortification: false
},
{
  id: 17,
  name: 'Donazione di Ubaldo',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiredFeudalType: 'ecclesiastico'
},
{
  id: 18,
  name: 'Donazione di Ugone',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiredFeudalType: 'ecclesiastico'
},
{
  id: 19,
  name: 'Matrimonio con Ildegarda',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiredFeudalType: 'laico'
},
{
  id: 20,
  name: 'Matrimonio con Rotruda',
  grain: 0,
  knights: 0,
  peasants: 10,
  manors: 2,
  productiveManors: 2,
  requiredFeudalType: 'laico'
}


];

export default events;