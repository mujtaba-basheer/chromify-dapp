import {
  createKeyStoreInteractor,
  createSingleSigAuthDescriptorRegistration,
  createWeb3ProviderEvmKeyStore,
  hours,
  registerAccount,
  registrationStrategy,
  ttlLoginRule,
} from "@chromia/ft4";
import { createClient } from "postchain-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { chromiaClientConfig, getChromiaClientDevConfig } from "../config";
import { useNotificationContext } from "./NotificationProvider";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { uint8_to_hexStr } from "../utils/string";
import { checkForDevMode } from "../utils";

// Create context for Chromia session
const ChromiaContext = createContext({
  session: undefined,
  account: undefined,
  wallet_address: "",
});

export function ContextProvider({ children }) {
  const [globalState, setGlobalState] = useState({
    session: undefined,
    account: undefined,
    wallet_address: "",
  });
  const clientRef = useRef(null);
  const notification = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const initClient = useCallback(async () => {
    if (clientRef.current) return;
    try {
      const isDevMode = checkForDevMode();
      const client = await createClient(
        isDevMode ? await getChromiaClientDevConfig() : chromiaClientConfig
      );
      clientRef.current = client;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const authenticateInstitute = useCallback(async (event) => {
    try {
      const client = clientRef.current;
      if (!client || !window.ethereum) return;

      // 2. Connect with MetaMask
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
      const wallet_address = uint8_to_hexStr(evmKeyStore.address).toUpperCase();
      setGlobalState((prev) => ({
        ...prev,
        wallet_address,
      }));

      // 3. Get all accounts associated with evm address
      const evmKeyStoreInteractor = createKeyStoreInteractor(
        client,
        evmKeyStore
      );
      const accounts = await evmKeyStoreInteractor.getAccounts();

      switch (event.type) {
        case "login_account": {
          if (accounts.length > 0) {
            try {
              // 4. Start a new session
              const { session } = await evmKeyStoreInteractor.login({
                accountId: accounts[0].id,
                config: {
                  rules: ttlLoginRule(hours(2)),
                  flags: ["MySession"],
                },
              });
              setGlobalState((prev) => ({ ...prev, session }));
              notification.success({
                message: "You've been logged in successfully!",
              });
              navigate("/certificates");
            } catch (error) {
              console.error(error);
              notification.error({
                message: "Error logging in! Please try again.",
              });
            }
          } else {
            notification.error({
              message: "No accounts found for this wallet!",
              description:
                "Please register first or try logging in with another wallet.",
            });
            setTimeout(() => window.location.reload(), 3_000);
          }
          break;
        }
        case "register_account": {
          if (accounts.length === 0) {
            // 5. Create a new account by signing a message using metamask
            const authDescriptor = createSingleSigAuthDescriptorRegistration(
              ["A", "T"],
              evmKeyStore.id
            );

            if (!event.detail) throw new Error("Missing register details!");

            try {
              const { name, address } = event.detail;
              const { session } = await registerAccount(
                client,
                evmKeyStore,
                registrationStrategy.open(authDescriptor, {
                  config: {
                    rules: ttlLoginRule(hours(2)),
                    flags: ["MySession"],
                  },
                }),
                {
                  name: "register_as_institute",
                  args: [wallet_address, name, address],
                }
              );
              setGlobalState((prev) => ({ ...prev, session }));
              notification.success({
                message: "Account registered successfully!",
              });
              navigate("/certificates");
            } catch (error) {
              console.error(error);
              notification.error({
                message: "Error registering your account! Please try again.",
              });
            }
          } else {
            notification.info({
              message: "You've already registered with this wallet.",
              description: "Logging you in",
            });
            const event = new CustomEvent("login_account", {});
            window.dispatchEvent(event);
          }
          break;
        }
        default: {
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const checkIsSessionValid = useCallback(() => {
    if (
      !globalState.session &&
      location.pathname !== "/register" &&
      location.pathname !== "/verify-certificate"
    ) {
      notification.error({
        message: "You're currently logged out!",
        description: "Redirecting to login page...",
      });
      setTimeout(() => {
        window.location.pathname = "/register";
      }, 3_000);
    }
  }, [globalState.session, location, notification]);

  const logout = useCallback(() => {
    const isDevMode = checkForDevMode();
    const qs = isDevMode ? "/?mode=dev" : "";
    window.location.pathname = `/register${qs}`;
  }, []);

  const fetchAccount = useCallback(async () => {
    try {
      const session = globalState.session;
      if (!session) return;

      // @ts-ignore
      const user = await session.query({
        name: "get_institute",
        args: {
          wallet_address: globalState.wallet_address,
        },
      });
      setGlobalState((prev) => ({ ...prev, account: user }));
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error fetching account details! Please try again.",
      });
    }
  }, [globalState.session]);

  useEffect(() => {
    initClient();
  }, [initClient]);

  useEffect(() => {
    window.addEventListener("register_account", authenticateInstitute, false);
    window.addEventListener("login_account", authenticateInstitute, false);

    return () => {
      window.removeEventListener(
        "register_account",
        authenticateInstitute,
        false
      );
      window.removeEventListener("login_account", authenticateInstitute, false);
    };
  }, [authenticateInstitute]);

  useEffect(() => {
    fetchAccount();

    window.addEventListener("refetch_account", fetchAccount, false);

    return () => {
      window.removeEventListener("refetch_account", fetchAccount, false);
    };
  }, [fetchAccount]);

  useEffect(() => {
    window.addEventListener("logout_account", logout, false);

    return () => {
      window.removeEventListener("logout_account", logout, false);
    };
  }, [logout]);

  useEffect(() => {
    const interval = setInterval(checkIsSessionValid, 3_000);
    return () => clearInterval(interval);
  }, [checkIsSessionValid]);

  return (
    <ChromiaContext.Provider value={globalState}>
      {children}
    </ChromiaContext.Provider>
  );
}

// Define hooks for accessing context
export function useSessionContext() {
  return useContext(ChromiaContext);
}
