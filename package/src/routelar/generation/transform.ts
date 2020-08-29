import { flatRoutes } from './flatRoutes';
import { isLeaf, normalizePath } from './generation.utils';
import { transformPathToState } from '../../utils/path';

export function transform(
  routes: Routelar.Generation.TransformRoutes,
  vRoutes: Routelar.Generation.VirtualRoutes = {},
  currentTuple = ['/']
): Routelar.Generation.VirtualRoutes {
  const flattenRoutes = flatRoutes(routes);

  Object.keys(flattenRoutes).forEach(path => {
    const isEndRoute = Object.keys(flattenRoutes[path]).length === 0;
    const isMultipath = path.includes('/');
    const nextTuple =
      path === 'root' || isMultipath
        ? currentTuple.slice()
        : currentTuple.concat(normalizePath(path));

    if (isMultipath) {
      const multiPathState = transformPathToState(path, []);
      let vRoutesNested = vRoutes;

      for (let i = 0; i < multiPathState.length; i += 1) {
        const separatePath = multiPathState[i];
        nextTuple.push(normalizePath(separatePath));

        if (i === multiPathState.length - 1) {
          if (isEndRoute) {
            vRoutesNested[separatePath] =
              separatePath in vRoutesNested
                ? {
                    ...vRoutesNested[separatePath],
                    root: nextTuple
                  }
                : nextTuple;
          } else {
            vRoutesNested[separatePath] = vRoutesNested[separatePath] ?? {};

            const transformedNestedRoutes = transform(
              flattenRoutes[path],
              vRoutesNested[separatePath] as Routelar.Generation.VirtualRoutes,
              nextTuple
            );
            if (isLeaf(vRoutesNested[separatePath])) {
              (vRoutesNested[
                separatePath
              ] as Routelar.Generation.VirtualRoutes).root = vRoutesNested[
                separatePath
              ] as Routelar.Generation.VirtualRoutesLeaf;
            }

            Object.keys(transformedNestedRoutes).forEach(route => {
              (vRoutesNested[
                separatePath
              ] as Routelar.Generation.VirtualRoutes)[route] =
                transformedNestedRoutes[route];
            });
          }
        } else if (isLeaf(vRoutesNested[separatePath])) {
          vRoutesNested[separatePath] = {
            root: vRoutesNested[separatePath]
          } as Routelar.Generation.VirtualRoutes;
          vRoutesNested = vRoutesNested[
            separatePath
          ] as Routelar.Generation.VirtualRoutes;
        } else {
          vRoutesNested[separatePath] = vRoutesNested[separatePath] ?? {};
          vRoutesNested = vRoutesNested[
            separatePath
          ] as Routelar.Generation.VirtualRoutes;
        }
      }
    } else if (isEndRoute) {
      vRoutes[path] =
        path in vRoutes ? { ...vRoutes[path], root: nextTuple } : nextTuple;
    } else {
      const transformedNestedRoutes = transform(
        flattenRoutes[path],
        vRoutes[path] as Routelar.Generation.VirtualRoutes,
        nextTuple
      );
      vRoutes[path] = isLeaf(vRoutes[path])
        ? ({
            root: vRoutes[path],
            ...transformedNestedRoutes
          } as Routelar.Generation.VirtualRoutes)
        : transformedNestedRoutes;
    }
  });

  return vRoutes;
}