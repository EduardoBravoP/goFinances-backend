/* eslint-disable prettier/prettier */
import { Repository, EntityRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction>{

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find()

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public async isValidTransaction(value: number): Promise<boolean> {
    const balance = await this.getBalance()
    const isValid = value <= balance.total;
    return isValid;
  }
}

export default TransactionsRepository;
