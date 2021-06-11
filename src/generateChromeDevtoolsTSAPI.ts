import path from 'path';

import {
  readFile,
  writeFile,
} from 'fs/promises';

const protocolPath = path.join(
  path.dirname(require.resolve('chrome-remote-interface')),
  'lib',
  'protocol.json',
);

const apiPath = path.join(__dirname, 'devtools', 'auto-generated-api.ts');

const splitLine = (text: string) => {
  const output = [];
  const words = text.split(/\s+/g);
  const currentLine = [];
  let currentLength = 0;

  const pushCurrentLine = () => {
    output.push(currentLine.join(' '));
    currentLine.splice(0, currentLine.length);
    currentLength = 0;
  };

  for (const word of words) {
    currentLine.push(word);
    currentLength += word.length;
    if (currentLength > 50) {
      pushCurrentLine();
    }
  }

  if (currentLine.length > 0) {
    pushCurrentLine();
  }

  return output;
};

const main = async () => {
  const data = await readFile(protocolPath);
  const protocol = JSON.parse(data.toString());

  let apiSourceCode = '';

  const types = new Map<string, string>();

  const desc = (command: any) => {
    let text = command.description || '';
    if (text) {
      text = splitLine(text).join('\n   ');
    }

    if (command.experimental) {
      text += '\n   @experimental';
    }

    return text ? `  /**\n   ${text}\n  */\n` : '';
  };

  const translateType = (parameter: any) => {
    if (parameter.type === 'integer') {
      return 'number';
    }

    if (parameter.type === 'array') {
      return `${(parameter.items.type && translateType(parameter.items.type)) || parameter.items.$ref}[]`;
    }

    return parameter.type;
  };

  const genType = (typeName: string, parameters: any[]) => {
    const lines = [`export type ${typeName} = {`];
    lines.push(parameters.map(
      (parameter: any) => [
        ...(parameter.description ?
          [
            '/**',
            ...splitLine(parameter.description).map((l) => ` ${l}`),
            '*/',
          ] : []),
        `${parameter.name}: ${(parameter.type && translateType(parameter)) || parameter.$ref};`,
      ].map((l) => `  ${l}`).join('\n'),
    ).join('\n\n'));
    lines.push('}');
    return lines.join('\n');
  };

  const commandSig = (command: any) => {
    if (!command.parameters) {
      return '() => Promise<void>';
    }

    const { name } = command;
    const ucfName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const paramsType = `${ucfName}Params`;
    const resultType = `${ucfName}Result`;

    types.set(paramsType, genType(paramsType, command.parameters));
    if (command.returns) {
      types.set(resultType, genType(resultType, command.returns));
    }

    return `(params: ${paramsType}) => Promise<${resultType}>`;
  };

  apiSourceCode += protocol.domains.map(
    (domain: any) => [
      `export interface ${domain.domain} {`,
      domain.commands.map((command: any) => [
        `${desc(command)}  ${command.name}: ${commandSig(command)};`,
      ]).join('\n\n'),
      '}',
    ].join('\n'),
  ).join('\n\n');

  apiSourceCode = `${[...types.values()].join('\n\n')}\n\n${apiSourceCode}`;

  await writeFile(apiPath, apiSourceCode);
  console.log(JSON.stringify(protocol.domains[0].commands, null, 2));
};

main();
