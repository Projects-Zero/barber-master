import { useTranslation } from 'react-i18next'


export const CATEGORIES = [
    {
        id: 1,
        name: 'homepage.products_title',
        navigate: 'Products',
        image: require('../../assets/images/products.png')
    },
    {
        id: 2,
        name: 'homepage.services_title',
        navigate: 'Services',
        image: require('../../assets/images/services.png')
    },
    {
        id: 3,
        name: 'homepage.booking_title',
        navigate: 'Bookings',
        image: require('../../assets/images/schedule.png')
    },
    {
        id: 4,
        name: 'homepage.barbers_title',
        navigate: 'Barbers',
        image: require('../../assets/images/barber.png')
    },
]