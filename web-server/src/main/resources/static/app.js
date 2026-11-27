const form = document.querySelector("#wallet-form");
const addressInput = document.querySelector("#wallet-address");
const message = document.querySelector("#form-message");
const transferForm = document.querySelector("#transfer-form");
const recipientInput = document.querySelector("#recipient-address");
const amountInput = document.querySelector("#transfer-amount");
const transferMessage = document.querySelector("#transfer-message");
const transferStatusValue = document.querySelector("#transfer-status-value");
const transferRecipientValue = document.querySelector("#transfer-recipient-value");
const transferAmountValue = document.querySelector("#transfer-amount-value");
const transferHashValue = document.querySelector("#transfer-hash-value");
const addressValue = document.querySelector("#address-value");
const balanceValue = document.querySelector("#balance-value");
const balanceUnit = document.querySelector("#balance-unit");
const nonceValue = document.querySelector("#nonce-value");
const networkValue = document.querySelector("#network-value");
const updatedValue = document.querySelector("#updated-value");
const submitButton = form.querySelector("button");
const transferButton = transferForm.querySelector("button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const address = addressInput.value.trim();
    if (!isWalletAddress(address)) {
        setMessage("올바른 EVM 지갑 주소를 입력하세요.", true);
        return;
    }

    setLoading(true);
    setMessage("조회 중입니다.", false);

    try {
        const wallet = await lookupWallet(address);
        renderWallet(wallet);
        setMessage("조회가 완료되었습니다.", false);
    } catch (error) {
        setMessage(error.message || "지갑 정보를 조회하지 못했습니다.", true);
    } finally {
        setLoading(false);
    }
});

transferForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const recipientAddress = recipientInput.value.trim();
    const amount = amountInput.value.trim();

    if (!isWalletAddress(recipientAddress)) {
        setTransferMessage("올바른 상대방 EVM 지갑 주소를 입력하세요.", true);
        renderTransferStatus("Invalid");
        return;
    }

    if (!isPositiveAmount(amount)) {
        setTransferMessage("전송할 금액은 0보다 큰 숫자로 입력하세요.", true);
        renderTransferStatus("Invalid");
        return;
    }

    setTransferLoading(true);
    setTransferMessage("전송 요청 중입니다.", false);
    renderTransferResult({
        recipientAddress,
        amount,
        transactionHash: "-",
        status: "Pending",
    });

    try {
        const transfer = await sendCoin(recipientAddress, amount);
        renderTransferResult({
            recipientAddress,
            amount,
            transactionHash: transfer.transactionHash,
            status: "Submitted",
        });
        setTransferMessage("", false);
        amountInput.value = "";
    } catch (error) {
        setTransferMessage(error.message || "코인 전송 요청에 실패했습니다.", true);
        renderTransferStatus("Failed");
    } finally {
        setTransferLoading(false);
    }
});

function isWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isPositiveAmount(amount) {
    const numberValue = Number(amount);
    return Number.isFinite(numberValue) && numberValue > 0;
}

async function lookupWallet(address) {
    const encodedAddress = encodeURIComponent(address);
    const [balance, nonce] = await Promise.all([
        fetchJson(`/api/v1/accounts/${encodedAddress}/balance`),
        fetchJson(`/api/v1/accounts/${encodedAddress}/nonce`),
    ]);

    return normalizeWallet(balance, nonce);
}

async function sendCoin(recipientAddress, amount) {
    try {
        const response = await fetch("/api/v1/transfers", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipientAddress,
                amount,
            }),
        });

        if (response.ok) {
            return normalizeTransfer(await response.json());
        }

        const errorBody = await readErrorBody(response);
        throw new Error(errorBody || "코인 전송 요청에 실패했습니다.");
    } catch (error) {
        throw new Error(error.message || "코인 전송 요청에 실패했습니다.");
    }
}

async function fetchJson(url) {
    let response;

    try {
        response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
        });
    } catch (error) {
        throw new Error("실제 지갑 정보를 조회하지 못했습니다. gateway 연결 상태를 확인하세요.");
    }

    if (!response.ok) {
        const errorBody = await readErrorBody(response);
        throw new Error(errorBody || "실제 지갑 정보를 조회하지 못했습니다.");
    }

    return response.json();
}

function normalizeWallet(balance, nonce) {
    return {
        address: balance.address,
        balance: balance.balance,
        nonce: nonce.nonce,
        symbol: balance.symbol,
        network: `Chain ID ${balance.chainId}`,
        updatedAt: new Date().toISOString(),
    };
}

function normalizeTransfer(data) {
    return {
        transactionHash: data.transactionHash || data.txHash || "pending",
    };
}

function renderWallet(wallet) {
    addressValue.textContent = wallet.address;
    balanceValue.textContent = formatBalance(wallet.balance);
    balanceUnit.textContent = wallet.symbol;
    nonceValue.textContent = Number(wallet.nonce).toLocaleString("ko-KR");
    networkValue.textContent = wallet.network;
    updatedValue.textContent = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(wallet.updatedAt));
}

function renderTransferResult(transfer) {
    transferRecipientValue.textContent = transfer.recipientAddress;
    transferAmountValue.textContent = `${formatBalance(transfer.amount)} ETH`;
    transferHashValue.textContent = transfer.transactionHash;
    renderTransferStatus(transfer.status);
}

function renderTransferStatus(status) {
    transferStatusValue.textContent = status;
}

function formatBalance(value) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return String(value);
    }

    return numberValue.toLocaleString("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
    });
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.querySelector("span:last-child").textContent = isLoading ? "조회 중" : "조회";
}

function setTransferLoading(isLoading) {
    transferButton.disabled = isLoading;
    transferButton.querySelector("span:last-child").textContent = isLoading ? "전송 중" : "전송";
}

function setMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function setTransferMessage(text, isError) {
    transferMessage.textContent = text;
    transferMessage.classList.toggle("error", isError);
}

async function readErrorBody(response) {
    try {
        const data = await response.json();
        return data.message || data.error || "";
    } catch (error) {
        return "";
    }
}
