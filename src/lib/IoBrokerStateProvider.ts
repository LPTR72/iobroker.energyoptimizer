import { toNumber } from "./config";
import { IStateProvider } from "./model";

export class IoBrokerStateProvider implements IStateProvider {
    public constructor(private readonly adapter: ioBroker.Adapter) {}

    public async readNumericState(sourceId: string | undefined): Promise<number | undefined> {
        const normalizedSourceId = sourceId?.trim();
        if (!normalizedSourceId) {
            return undefined;
        }

        try {
            const sourceState = await this.adapter.getForeignStateAsync(normalizedSourceId);
            if (!sourceState || sourceState.val === null || sourceState.val === undefined) {
                this.adapter.log.debug(`Source state "${normalizedSourceId}" has no value`);
                return undefined;
            }

            const value = toNumber(sourceState.val);
            if (value === undefined) {
                this.adapter.log.warn(`Source state "${normalizedSourceId}" is not numeric: ${String(sourceState.val)}`);
                return undefined;
            }

            return value;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.adapter.log.warn(`Could not read source state "${normalizedSourceId}": ${message}`);
            return undefined;
        }
    }
}
