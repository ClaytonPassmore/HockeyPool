from subprocess import call

from config import DBConfig


def main():
    cmd = 'mysql -u{0} -p{1} < {2}'.format(DBConfig.USER, DBConfig.PASSWORD, DBConfig.CREATEFILE)
    print(cmd)
    status = call(cmd, shell=True)
    exit(status)


if __name__ == '__main__':
    main()
