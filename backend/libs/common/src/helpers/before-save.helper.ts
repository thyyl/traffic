import { isEmpty } from 'lodash';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

export async function createOrUpdateWithBeforeSave<
  Entity extends ObjectLiteral,
  Input extends DeepPartial<Entity>
>({
  input,
  repository,
  beforeSave,
  current
}: {
  input: Input;
  repository: Repository<Entity>;
  beforeSave?: (newEntity: Entity) => any | Promise<any>;
  current?: Entity;
}): Promise<Entity> {
  const entity = isEmpty(current)
    ? repository.create(input)
    : Object.assign(current, input);

  if (typeof beforeSave === 'function') {
    await beforeSave(entity);
  }

  return repository.save(entity as DeepPartial<Entity>);
}
