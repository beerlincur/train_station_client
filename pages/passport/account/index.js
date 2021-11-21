import AccountClient from "../../../components/Account/AccountClient";
import DefaultLayout from "../../../layouts/DefaultLayout";

const account = () => {
    return <AccountClient/>
}

account.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default account