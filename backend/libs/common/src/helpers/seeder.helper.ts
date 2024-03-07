type basicEntity = {
  id: string;
};
export class SeedHelper {
  static async getExistingIds(
    inputs,
    entityClass,
    connection
  ): Promise<string[]> {
    const ids = inputs
      .map((entity) => entity.id)
      .filter((item) => item !== undefined);
    const result = await connection.manager.findByIds(entityClass, ids);
    const existedIds = result.map((entity) => entity.id);
    return existedIds;
  }

  static getUnique<T extends { id: string }>(
    existingInputs: string[],
    inputs: T[]
  ): T[] {
    return inputs.filter(
      (company) => existingInputs.indexOf(company.id) === -1
    );
  }
}
