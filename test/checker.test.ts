import { diff } from '@/checker/diff';


test('diff', () => {
    expect(diff('test/source', 'test/target')).toBe('diff');
});
