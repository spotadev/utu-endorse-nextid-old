# next.id

This doc gives instructions on how to link your X account to your next.id Universal ID

Information taken from:

  [https://docs.next.id/getting-started/twitter-wallet-binding](https://docs.next.id/getting-started/twitter-wallet-binding)

## Steps

### Install python

    Mac
    ===

      (i) Install Homebrew

          /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

      (ii) Install pyenv using Homebrew

          See https://github.com/pyenv/pyenv#homebrew-in-macos

          brew update
          brew install pyenv

      (iii) Install python

          pyenv install 3.8.15

      (iv) To see versions:

        pyenv versions

      (v) To select version:

        pyenv global 3.8.15

      (vi) You can overide pyenv version by creating:
    
        ~/.python-version 

        and adding the version number on the first line of that file.

      (vii) Note if python is not in the path add the following to your ~/.zshrc file:

        eval "$(pyenv init -)"
  
    Ubuntu
    ======

      @todo

    Other
    =====

      @todo

### install pip package manager

  Mac
  ===

    If pip is not in the path:

      python -m ensurepip

### Generate private / public keys

  pip install secp256k1

  python -m secp256k1 privkey -p | tee -a keys.txt

  Note:  keys.txt was generated with your private and public keys in it.  keys.txt is in .gitignore
  so it cannot be pushed to the git repo.

  The tee command allows you to see the keys on the console as well as putting them in keys.txt

###

## How to model the above manual steps in utu-endorse-nextid

@todo