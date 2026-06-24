class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let current = this.root;

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }

      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
  }

  searchPrefix(prefix: string, limit = 5): string[] {
    let current = this.root;

    for (const char of prefix) {
      const nextNode = current.children.get(char);

      if (!nextNode) {
        return [];
      }

      current = nextNode;
    }

    const results: string[] = [];
    this.collectWords(current, prefix, results, limit);

    return results;
  }

  private collectWords(
    node: TrieNode,
    currentWord: string,
    results: string[],
    limit: number
  ): void {
    if (results.length >= limit) {
      return;
    }

    if (node.isEndOfWord) {
      results.push(currentWord);
    }

    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, currentWord + char, results, limit);
    }
  }
}

export function buildTrie(words: string[]): Trie {
  const trie = new Trie();

  for (const word of words) {
    trie.insert(word);
  }

  return trie;
}