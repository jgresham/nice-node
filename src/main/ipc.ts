import { ipcMain } from 'electron';
import getDebugInfo from './debug';
import { getGethLogs, getGethErrorLogs, getSystemFreeDiskSpace } from './files';
import {
  getDefaultNodeConfig,
  setToDefaultNodeConfig,
  getNodeConfig,
  NodeConfig,
  setDirectInputNodeConfig,
  changeNodeConfig,
} from './state/nodeConfig';
import store from './state/store';
import logger from './logger';
import {
  checkSystemHardware,
  getMainProcessUsage,
  getNodeUsage,
  updateNodeUsedDiskSpace,
} from './monitor';
import { addNode, startNode, stopNode, removeNode } from './nodeManager';
import { getNodes, getNode, getUserNodes } from './state/nodes';
import { NodeId } from '../common/node';
import { NodeSpecification } from '../common/nodeSpec';
import { isDockerInstalled } from './docker';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle('updateNodeUsedDiskSpace', (_event, nodeId: NodeId) => {
    return updateNodeUsedDiskSpace(nodeId);
  });
  ipcMain.handle('getSystemFreeDiskSpace', getSystemFreeDiskSpace);
  ipcMain.handle('getDebugInfo', getDebugInfo);
  ipcMain.handle('getStoreValue', (_event, key: string) => {
    const value = store.get(key);
    logger.info(`store.get(key, value): ${key},${value}`);
    return value;
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle('setStoreValue', (_event, key: string, value: any) => {
    logger.info(`store.set(key, value): ${key},${value}`);
    return store.set(key, value);
  });
  ipcMain.handle('getGethLogs', getGethLogs);
  ipcMain.handle('getGethErrorLogs', getGethErrorLogs);
  ipcMain.handle('getNodeConfig', (_event, node: string) => {
    console.log('ipc main handle getNodeConfig: ', node);
    return getNodeConfig(node);
  });
  ipcMain.handle(
    'changeNodeConfig',
    (_event, node: string, nodeConfig: NodeConfig) => {
      return changeNodeConfig(node, nodeConfig);
    }
  );
  ipcMain.handle('getDefaultNodeConfig', (_event, node: string) => {
    console.log('main handle getDefaultNodeConfig');
    return getDefaultNodeConfig(node);
  });
  ipcMain.handle('setToDefaultNodeConfig', (_event, node: string) => {
    console.log('main node: ', node);
    return setToDefaultNodeConfig(node);
  });
  ipcMain.handle(
    'setDirectInputNodeConfig',
    (_event, node: string, directInput: string[]) => {
      return setDirectInputNodeConfig(node, directInput);
    }
  );
  ipcMain.handle('getNodeUsage', getNodeUsage);
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);

  // Multi-nodegetUserNodes
  ipcMain.handle('getNodes', getNodes);
  ipcMain.handle('getUserNodes', getUserNodes);
  ipcMain.handle('addNode', (_event, nodeSpec: NodeSpecification) => {
    return addNode(nodeSpec);
  });
  ipcMain.handle('removeNode', (_event, nodeId: NodeId) => {
    return removeNode(nodeId);
  });
  ipcMain.handle('startNode', (_event, nodeId: NodeId) => {
    return startNode(nodeId);
  });
  ipcMain.handle('stopNode', (_event, nodeId: NodeId) => {
    return stopNode(nodeId);
  });

  // Settings/Config
  ipcMain.handle('getIsDockerInstalled', isDockerInstalled);
};
