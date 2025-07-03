import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepoServices } from 'src/DB';
import { OpenDto } from './Dto/openRouterDto';
import { EnumRole, openRouter } from 'src/common';
// Make sure openRouter is properly typed, for example:
import { AxiosInstance } from 'axios';
import { Types } from 'mongoose';
// If openRouter is an Axios instance, you can assert its type:
const typedOpenRouter = openRouter as AxiosInstance;

@Injectable()
export class OpenrouterService {
  constructor(private readonly productRepo: ProductRepoServices) {}

  async FindBestBrandForItem(data: OpenDto): Promise<object> {
    const { price, subCategory } = data;
    if (!price || !subCategory)
      throw new BadRequestException('Enter Your price & type of item');

    const products = await this.productRepo.find({
      price: { $lte: price },
      subCategory: new Types.ObjectId(subCategory),
    });

    if (products?.length === 0)
      return { message: 'No Product Found With this Salary' };

    const prompt = `
        You are an expert AI shopping assistant with strong knowledge of mobile phone brands and their real-world performance.

        I will give you a list of mobile phone products in JSON format. Each product includes:
        - name (includes model and brand)
        - price
        - description (may contain specifications like RAM, processor, battery, etc.)
        - discount
        - average rating (rateAverage)
        - number of ratings (rateNumber)

        Your task:
        From the **provided list ONLY**, recommend the **single best-performing phone** under a budget of ${price} EGP.

        You are allowed to use your prior knowledge of phone brands and models (like real-world benchmarks, typical performance of certain processors or brands) to judge performance.

        Evaluate based on:
        - Real-world performance of the model
        - Price-to-performance ratio
        - Known brand reliability
        - Ratings and reviews
        - Any discount applied

        Be honest and unbiased. Do NOT recommend a product just because it appears first in the list.

        Your response must include:
        1. ✅ Product name
        2. ✅ A short explanation: Why is this product the best choice in this price range?
        3. ✅ Any notable performance specs or advantages (based on your own knowledge + the product description)

        Here is the product data:
        ${JSON.stringify(products, null, 2)}
    `;
    try {
      const response = await typedOpenRouter.post('/chat/completions', {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: EnumRole.user,
            content: prompt,
          },
        ],
      });
      if (!response) {
        throw new BadRequestException('Invalid response from OpenRouter');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const message = response.data.choices?.[0]?.message?.content;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { message };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch recommendations from OpenRouter',
      );
    }
  }
}
