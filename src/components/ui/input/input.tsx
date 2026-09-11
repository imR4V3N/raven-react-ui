import type {InputType} from "../../types/input/input-type";

export function Input(input: InputType) {
    // const [showPassword, setShowPassword] = useState(false);
    // const isPassword = input.type === 'password';
    //
    // const inputType = isPassword ? (showPassword ? 'text' : 'password') : input.type;

    return (
        <div className="flex flex-col w-fit">
            {input.label && (
                <label
                    className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${input.textSize || 'text-xs'}`}
                >
                    {input.label} {input.isRequired && '*'}
                </label>
            )}

            <div className="relative">
                <input
                    className={`
                        ${input.width || 'w-70'} ${input.height || 'h-10'} ${input.textSize || 'text-xs'}
                        border border-black/30 pl-3 pr-3 py-2.5 rounded-lg 
                        bg-surface-container-low text-on-surface 
                        focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent
                        ${input.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${input.error ? 'border-red-500 focus:ring-red-500' : ''}
                        ${input.className}
                    `}
                    placeholder={input.placeholder}
                    type={input.type}
                    minLength={input.minLength}
                    maxLength={input.maxLength}
                    value={input.value}
                    onChange={input.onChange}
                    name={input.name}
                    id={input.id}
                    disabled={input.disabled}
                />

                {/*{isPassword && (*/}
                {/*    <ButtonUI type="button" state="normal"*/}
                {/*        onClick={() => setShowPassword(!showPassword)}*/}
                {/*        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"*/}
                {/*        icon={showPassword ? (*/}
                {/*                EyeOff*/}
                {/*            ) : (*/}
                {/*                Eye)} />*/}
                {/*)}*/}
            </div>

            {input.error && (
                <p className={`mt-1 ${input.textSize || 'text-xs'} text-red-500`}>
                    {input.error}
                </p>
            )}
        </div>
    );
}