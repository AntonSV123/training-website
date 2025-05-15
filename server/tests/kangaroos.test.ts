import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Kangaroo } from '../src/models/kangaroo';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про Кенгуру
describe('API вебдодатку сайту про Кенгуру', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/kangaroos-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "kangaroos-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію Кенгуру
    beforeEach(async () => {
        await Kangaroo.deleteMany({});
    });

    // Тести для створення запису про нового Кенгуру (POST-запит)
    describe('POST /api/kangaroos', () => {
        it('має створити запис про нового Кенгуру', done => {
            // Тестові дані Кенгуру
            const kangaroo = {
                name: 'Стрибун',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Гарний Кенгуру',
                pouchSize: '3 см3',
            };

            // Виконуємо POST-запит для створення запису про Кенгуру
            chai.request(app)
                .post('/api/kangaroos')
                .send(kangaroo)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', kangaroo.name);
                    expect(res.body).to.have.property('age', kangaroo.age);
                    expect(res.body).to.have.property('height', kangaroo.height);
                    expect(res.body).to.have.property('weight', kangaroo.weight);
                    expect(res.body).to.have.property('gender', kangaroo.gender);
                    expect(res.body).to.have.property('description', kangaroo.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(res.body).to.have.property('pouchSize', kangaroo.pouchSize);
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів Кенгуру (GET-запит)
    describe('GET /api/kangaroos', () => {
        it('має отримати всіх Кенгуру', async () => {
            // Створюємо тестовий запис Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Бігун',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Великий Кенгуру',
                pouchSize: '3 см3',
            });
            await testKangaroo.save();

            // Виконуємо GET-запит для отримання всіх записів Кенгуру
            const res = await chai.request(app).get('/api/kangaroos');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Бігун');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Великий Кенгуру');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(res.body[0]).to.have.property('pouchSize', '3 см3');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного Кенгуру за ID (GET-запит)
    describe('GET /api/kangaroos/:id', () => {
        it('має отримати конкретного Кенгуру за id', async () => {
            // Створюємо запис тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Кенгуру',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричневий Кенгуру',
                pouchSize: '3 см3',
            });
            const savedKangaroo = await testKangaroo.save();

            // Виконуємо GET-запит для отримання запису Кенгуру за ID
            const res = await chai.request(app).get(`/api/kangaroos/${String(savedKangaroo._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Кенгуру');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий Кенгуру');
            expect(res.body).to.have.property('pouchSize', '3 см3');
        });

        it('має повернути 404 для неіснуючого Кенгуру', async () => {
            // Виконуємо GET-запит для неіснуючого ID Кенгуру
            const res = await chai.request(app).get('/api/kangaroos/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про Кенгуру (PUT-запит)
    describe('PUT /api/kangaroos/:id', () => {
        it('має повністю оновити запис про Кенгуру', async () => {
            // Створюємо тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                pouchSize: '3 см3',
            });
            const savedKangaroot = await testKangaroo.save();

            // Дані для оновлення Кенгуру
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                pouchSize: '5 см3',
            };

            // Виконуємо PUT-запит для повного оновлення запису про Кенгуру
            const res = await chai
                .request(app)
                .put(`/api/kangaroos/${String(savedKangaroot._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('pouchSize', '5 см3');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                pouchSize: '3 см3',
            });
            const savedKangaroo = await testKangaroo.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
                pouchSize: '3 см3',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/kangaroos/${String(savedKangaroo._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що Кенгуру не змінився
            const unchangedKangaroo = await Kangaroo.findById(savedKangaroo._id);
            expect(unchangedKangaroo).to.have.property('name', 'Оригінальний');
            expect(unchangedKangaroo).to.have.property('height', 25);
            expect(unchangedKangaroo).to.have.property('weight', 1.8);
            expect(unchangedKangaroo).to.have.property('pouchSize', '3 см3');
        });
    });

    // Тести для часткового оновлення запису про Кенгуру (PATCH-запит)
    describe('PATCH /api/kangaroos/:id', () => {
        it('має частково оновити запис про Кенгуру', async () => {
            // Створюємо тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                pouchSize: '3 см3',
            });
            const savedKangaroo = await testKangaroo.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                pouchSize: '5 см3',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/kangaroos/${String(savedKangaroo._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('pouchSize', '5 см3');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                pouchSize: '3 см3',
            });
            const savedKangaroo = await testKangaroo.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
                pouchSize: '3 см3',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/kangaroos/${String(savedKangaroo._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('pouchSize', '3 см3');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/kangaroos', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/kangaroos')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису Кенгуру (DELETE-запит)
    describe('DELETE /api/kangaroos/:id', () => {
        it('має видалити запис про Кенгуру', async () => {
            // Створюємо тестового Кенгуру
            const testKangaroo = new Kangaroo({
                name: 'Жінка Кенгуру',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Миле Кенгуру',
                pouchSize: '3 см3',
            });
            const savedKangaroo = await testKangaroo.save();

            // Виконуємо DELETE-запит
            const res = await chai
                .request(app)
                .delete(`/api/kangaroos/${String(savedKangaroo._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про Кенгуру видалено');

            // Перевіряємо, що запис про Кенгуру дійсно видалено з бази
            const findKangaroo = await Kangaroo.findById(savedKangaroo._id);
            expect(findKangaroo).to.be.null;
        });
    });
});
