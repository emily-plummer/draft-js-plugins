import { Modifier, EditorState } from '@bufferapp/draft-js';
import getSearchText from '../utils/getSearchText';
import getTypeByTrigger from '../utils/getTypeByTrigger';

const addMention = (editorState, mention, mentionPrefix, mentionTrigger, entityMutability) => {
  const contentStateWithEntity = editorState.getCurrentContent().createEntity(
    getTypeByTrigger(mentionTrigger), entityMutability, { mention }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const currentSelectionState = editorState.getSelection();
  const { begin, end } = getSearchText(editorState, currentSelectionState, mentionTrigger);

  // get selection of the @mention search text
  const mentionTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  });

  let mentionReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    mentionTextSelection,
    `${mentionPrefix}${mention.get('name')}`,
    null, // no inline style needed
    entityKey
  );

  // If the mention is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = mentionTextSelection.getAnchorKey();
  const block = editorState.getCurrentContent().getBlockForKey(blockKey);
  const blockSize = block.getLength();
  const isInsertedAtEnd = (
    blockSize === end ||
    /\n\r|\r|\n/.test(block.getText().charAt(end)) // When using soft new lines
  );

  if (isInsertedAtEnd) {
    mentionReplacedContent = Modifier.insertText(
      mentionReplacedContent,
      mentionReplacedContent.getSelectionAfter(),
      ' ',
    );
  }

  const newEditorState = EditorState.push(
    editorState,
    mentionReplacedContent,
    'insert-mention',
  );
  return EditorState.forceSelection(newEditorState, mentionReplacedContent.getSelectionAfter());
};

export default addMention;
