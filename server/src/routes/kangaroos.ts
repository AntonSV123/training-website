import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { KangarooRepository } from '../repositories/KangarooRepository';

// Створюємо новий роутер Express
const router = Router();
// Отримуємо екземпляр репозиторію Кенгуру з контейнера інверсії залежностей
const kangarooRepository = container.get(KangarooRepository);

// Роутер для HTTP метода GET / - отримання всіх записів Кенгуру
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи Кенгуру з бази даних через репозиторій
        const kangaroos = await kangarooRepository.findAll();
        res.json(kangaroos);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода GET /:id - отримання запису одного Кенгуру за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук Кенгуру за ідентифікатором
        const kangaroo = await kangarooRepository.findById(req.params.id);
        if (kangaroo) {
            res.json(kangaroo);
        } else {
            // Якщо Кенгуру не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис Кенгуру не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода POST / - створення нового запису Кенгуру
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис Кенгуру з даних запиту
        const newKangaroo = await kangarooRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного Кенгуру
        res.status(201).json(newKangaroo);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PUT /:id - повне оновлення запису Кенгуру
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо Кенгуру з вказаним ID
        const kangaroo = await kangarooRepository.update(req.params.id, req.body);
        if (kangaroo) {
            return res.json(kangaroo);
        } else {
            // Якщо Кенгуру не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис Кенгуру не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PATCH /:id - часткове оновлення запису Кенгуру
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису Кенгуру - передаються лише ті поля, які потрібно змінити
        const kangaroo = await kangarooRepository.patch(req.params.id, req.body);
        if (kangaroo) {
            res.json(kangaroo);
        } else {
            // Якщо Кенгуру не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис Кенгуру не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода DELETE /:id - видалення запису Кенгуру
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про Кенгуру за ID
        const kangaroo = await kangarooRepository.delete(req.params.id);
        if (kangaroo) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про Кенгуру видалено' });
        } else {
            // Якщо Кенгуру не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про Кенгуру не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
