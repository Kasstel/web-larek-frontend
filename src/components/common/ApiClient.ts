import {
	IApiClient,
	IOrderPost,
	IProduct,
	OrderResponse,
} from '../../types/index';
import { Api, ApiListResponse } from '../base/api';

export class ApiClient extends Api implements IApiClient {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	placeOrder(order: IOrderPost): Promise<OrderResponse> {
		return this.post(`/order`, order).then((data: OrderResponse) => data);
	}
}
