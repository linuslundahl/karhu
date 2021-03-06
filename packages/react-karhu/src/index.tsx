import React, { useContext, useEffect, useState } from 'react';
import Karhu from '@karhu/core';
import { Command, UnregisteredCommand, EntryGraph } from '@karhu/core/lib/types';

type KarhuContextProps = { karhu: Karhu };
const KarhuContext = React.createContext<Partial<KarhuContextProps>>({});

type ChildrenProviderObject = {
  commandsList: Command[];
  exec: (id: string) => EntryGraph;
};

type AddCommandProps = {
  command: UnregisteredCommand;
};

export const AddCommand = (props: AddCommandProps) => {
  const karhuContext: Partial<KarhuContextProps> = useContext(KarhuContext);
  const { karhu } = karhuContext;

  useEffect(() => {
    if (karhu) {
      karhu.addCommand(props.command);
    }
  }, []);

  return null;
};

export function useKarhu(input: string): ChildrenProviderObject {
  const karhuContext: Partial<KarhuContextProps> = useContext(KarhuContext);
  const { karhu } = karhuContext;
  const [commandsList, setCommandsList] = useState<Command[]>([]);
  if (!karhu) {
    throw new Error('Karhu not found');
  }

  useEffect(
    () => {
      const list = karhu.findMatchingCommands(input);
      setCommandsList(list);
    },
    [input],
  );

  const exec = (id: string): EntryGraph => {
    return karhu.runCommand(id, input);
  };

  return { commandsList, exec };
}

type Props = {
  children: (obj: ChildrenProviderObject) => JSX.Element;
  input: string;
};
export function KarhuComponent(props: Props) {
  const { children } = props;
  const { exec, commandsList } = useKarhu(props.input);
  return children({ commandsList, exec });
}

const { Provider, Consumer } = KarhuContext;
export { Provider as KarhuProvider, Consumer as KarhuConsumer, KarhuContext };
