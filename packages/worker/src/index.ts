import { Router, listen } from 'worktop';
import faunadb from 'faunadb';
import { getFaunaError } from './utils';

type DailyConsumption = {
  changeType: number;
  // count: number;
  // consumptionType: number;
  // date: string;
  // mark?: string;
}

const router = new Router();

const faunaClient = new faunadb.Client({
  secret: 'fnAEzHYl05ACSyuXBhlVUmqHoicaf9eCLqd8DIg2',
});

const { Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update } = faunadb.query;

router.add('GET', '/days/:dateId', async (request, response) => {
  try {
    const dateId = request.params.dateId;
    console.log('dateId: ', dateId);

    const result = await faunaClient.query(
      Get(Ref(Collection('Days'), dateId))
    );
    console.log('result: ', result);

    response.send(200, result);

  } catch (error) {
    const faunaError = getFaunaError(error);
    response.send(faunaError.status, faunaError);
  }
});

router.add('POST', '/days', async (request, response) => {
  try {
    const data = await request.body();

    if (!data) throw new Error('body is empty');

    const {
      changeType = 0,
      // count,
      // consumptionType,
      // date,
      // mark = '',
    } = data as DailyConsumption;

    const result = await faunaClient.query(
      Create(
        Collection('Days'),
        {
          data: {
            changeType,
            // count,
            // consumptionType,
            // date,
            // mark
          }
        }
      )
    );

    response.send(200, {
      date: result.ref.id
    });
  } catch (error) {
    const faunaError = getFaunaError(error);
    response.send(faunaError.status, faunaError);
  }
});

listen(router.run);