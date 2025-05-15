import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Кенгуру"
interface IKangaroo {
    name: string; // Ім'я Кенгуру
    age: number; // Вік Кенгуру у роках
    height: number; // Висота Кенгуру в сантиметрах
    weight: number; // Вага Кенгуру в кілограмах
    gender: 'male' | 'female'; // Стать Кенгуру: 'male' - самець, 'female' - самка
    description?: string; // Опис Кенгуру (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Кенгуру"
const kangarooSchema = new Schema<IKangaroo>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
});

// Створення моделі Mongoose на основі схеми
export const Kangaroo = model<IKangaroo>('Kangaroo', kangarooSchema);
export type { IKangaroo }; // Експортуємо інтерфейс для використання в інших файлах
