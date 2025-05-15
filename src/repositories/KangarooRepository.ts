import { injectable } from 'inversify';
import { Kangaroo, IKangaroo } from '../models/kangaroo';

// Клас-репозиторій для роботи з Кенгуру
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class KangarooRepository {
    // Метод для отримання всіх Кенгуру з бази даних
    public async findAll(): Promise<IKangaroo[]> {
        return Kangaroo.find();
    }

    // Метод для пошуку Кенгуру за унікальним ідентифікатором
    public async findById(id: string): Promise<IKangaroo | null> {
        return Kangaroo.findById(id);
    }

    // Метод для створення нового Кенгуру в базі даних
    public async create(kangarooData: IKangaroo): Promise<IKangaroo> {
        const kangaroo = new Kangaroo(kangarooData);
        return kangaroo.save();
    }

    // Метод для видалення Кенгуру за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Kangaroo.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про Кенгуру (заміна всіх полів)
    public async update(id: string, kangarooData: IKangaroo): Promise<IKangaroo | null> {
        return Kangaroo.findByIdAndUpdate(id, kangarooData, { new: true });
    }

    // Метод для часткового оновлення даних про Кенгуру (оновлення лише вказаних полів)
    public async patch(id: string, kangarooData: Partial<IKangaroo>): Promise<IKangaroo | null> {
        return Kangaroo.findByIdAndUpdate(id, { $set: kangarooData }, { new: true });
    }
}
