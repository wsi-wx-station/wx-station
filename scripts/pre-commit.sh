# This basic file was cribbed liberally from the post at
# https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/
# but the Git commands have been updated for current best practices.

# Sanity checker. Alerts to STDOUT that the pre-commit hook is about to run
# echo "Running the pre-commit hook..."

# Stash any unstaged changes so that they don't interefere with the test suite
# (Ordinarily, tests are run on the code in the working directory, not just the
# code that has been staged).
STASH_NAME="pre-commit-$(date +%s)"
# Use the preferred `push` command; keep the index untouched, and stash any untracked files
git stash push -q --keep-index --include-untracked --message $STASH_NAME

# Run the NPM test suite...
npm test
# ...and then capture its exit code.
RESULT=$?

# Look through the list of stashes for the match...
STASHES=$(git stash list -1 | grep -o $STASH_NAME)
# If there's a match with the earlier stash,
# restore it quietly (-q)
if [[ $STASHES == $STASH_NAME ]]; then
  # echo "Restoring stashed changes..."
  git reset --hard -q && git stash apply --index -q && git stash drop -q
fi

# Finally, if a non-zero (a non-sucessful status) returns from the test suite,
# exit with status 1 (and thus halt the commit in its tracks).
# Otherwise, exit with an okay status (0) and procreed with the commit.
# [ $RESULT -ne 0 ] && echo "Pre-commit hook failed!" && exit 1
# echo "Pre-commit hook successful!" && exit 0
[ $RESULT -ne 0 ] && exit 1
exit 0
